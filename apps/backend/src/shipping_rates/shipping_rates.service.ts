import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { ShippingRate } from './entities/shipping_rate.entity';
import { Zone } from './entities/zone.entity';
import { InternationalCountry } from './entities/international-country.entity';
import { InternationalTariff } from './entities/international-tariff.entity';




import {
  CreateShippingRateDto,
  UpdateShippingRateDto,
  ShippingRateResponseDto,
} from './dto/create-shipping_rate.dto';

@Injectable()
export class ShippingRateService {
  constructor(
    @InjectRepository(ShippingRate)
    private shippingRateRepository: Repository<ShippingRate>,

    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,

    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @InjectRepository(InternationalCountry)
    private countryRepository: Repository<InternationalCountry>,

    @InjectRepository(InternationalCountry)
    private internationalCountryRepository: Repository<InternationalCountry>, // ← ESTA LÍNEA

    @InjectRepository(InternationalTariff)
    private readonly tariffRepository: Repository<InternationalTariff>,
  ) { }

  async getInternationalTariff(paisDestino: string, peso: number) {
    const country = await this.internationalCountryRepository.findOne({
      where: { name: paisDestino },
      relations: ['zone'],
    });

    if (!country || !country.zone) {
      throw new NotFoundException('País o zona no encontrada');
    }

    const tarifa = await this.tariffRepository.findOne({
      where: {
        zone: { id: country.zone.id },
        max_kg: MoreThanOrEqual(peso),
      },
      order: { max_kg: 'ASC' },
    });

    if (!tarifa) {
      throw new NotFoundException('No se encontró tarifa para ese peso');
    }

    const excedente = peso - tarifa.max_kg;
    const adicional = excedente > 0 && tarifa.additional_per_kg ? excedente * tarifa.additional_per_kg : 0;
    const subtotal = tarifa.base_price + adicional;
    const iva = subtotal * (tarifa.iva_percent / 100);
    const total = subtotal + iva;

    return {
      zona: country.zone.code,
      descripcionZona: country.zone.description,
      peso,
      precioBase: tarifa.base_price,
      adicional: +adicional.toFixed(2),
      iva: +iva.toFixed(2),
      total: +total.toFixed(2),
    };
  }

  async create(createShippingRateDto: CreateShippingRateDto): Promise<ShippingRateResponseDto> {
    const shippingRate = this.shippingRateRepository.create(createShippingRateDto);
    const savedRate = await this.shippingRateRepository.save(shippingRate);
    return this.mapToResponseDto(savedRate);
  }

  async createMany(createShippingRateDtos: CreateShippingRateDto[]): Promise<ShippingRateResponseDto[]> {
    const shippingRates = this.shippingRateRepository.create(createShippingRateDtos);
    const savedRates = await this.shippingRateRepository.save(shippingRates);
    return savedRates.map((rate) => this.mapToResponseDto(rate));
  }

  async findAll(): Promise<ShippingRateResponseDto[]> {
    const rates = await this.shippingRateRepository.find({
      relations: ['zone', 'service'],
      order: { id: 'ASC' },
    });
    return rates.map((rate) => this.mapToResponseDto(rate));
  }

  async findOne(id: number): Promise<ShippingRateResponseDto> {
    const rate = await this.shippingRateRepository.findOne({
      where: { id },
      relations: ['zone', 'service'],
    });

    if (!rate) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }

    return this.mapToResponseDto(rate);
  }

  async update(id: number, updateShippingRateDto: UpdateShippingRateDto): Promise<ShippingRateResponseDto> {
    const rate = await this.shippingRateRepository.findOne({ where: { id } });

    if (!rate) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }

    Object.assign(rate, updateShippingRateDto);
    const updatedRate = await this.shippingRateRepository.save(rate);
    return this.mapToResponseDto(updatedRate);
  }

  async remove(id: number): Promise<void> {
    const result = await this.shippingRateRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }
  }

  async findZoneByDistance(distanceKm: number): Promise<Zone | null> {
    return this.zoneRepository.findOne({
      where: {
        minDistance: LessThanOrEqual(distanceKm),
        maxDistance: MoreThanOrEqual(distanceKm),
      },
    });
  }

  async findShippingRateByZoneAndWeight(
    zoneId: number,
    weight: number,
    serviceId: number,
  ): Promise<ShippingRate> {
    const rate = await this.shippingRateRepository.findOne({
      where: {
        zone: { id: zoneId },
        service: { id: serviceId },
        kgMin: LessThanOrEqual(weight),
        kgMax: MoreThanOrEqual(weight),
      },
      relations: ['zone', 'service'],
    });

    if (!rate) {
      throw new NotFoundException(
        `No shipping rate found for zone ${zoneId}, service ${serviceId}, and weight ${weight}kg`,
      );
    }

    return rate;
  }

  async findTarifa(zonaId: number, servicioId: number, peso: number): Promise<ShippingRate | null> {
    return await this.shippingRateRepository
      .createQueryBuilder('rate')
      .where('rate.zone_id = :zonaId', { zonaId })
      .andWhere('rate.service_id = :servicioId', { servicioId })
      .andWhere(':peso BETWEEN rate.kg_min AND rate.kg_max', { peso })
      .getOne();
  }

  async getDatosZonaYDistancia(codigoOrigen: string, codigoDestino: string): Promise<{
    distanciaKm: number;
    zona: Zone;
    ciudadOrigen: string;
    ciudadDestino: string;
  }> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    const getCoords = async (cp: string) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cp},MX&key=${apiKey}`;
      const res = await firstValueFrom(this.httpService.get(url));
      const location = res.data.results?.[0]?.geometry?.location;
      if (!location) throw new NotFoundException(`No se pudo geocodificar el CP: ${cp}`);
      return location;
    };

    const origen = await getCoords(codigoOrigen);
    const destino = await getCoords(codigoDestino);

    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&mode=driving&language=es&key=${apiKey}`;
    const distanceRes = await firstValueFrom(this.httpService.get(distanceUrl));
    const element = distanceRes.data.rows?.[0]?.elements?.[0];

    if (element?.status !== 'OK') {
      throw new NotFoundException('No se pudo calcular la distancia entre los CP');
    }

    const distanciaKm = Math.ceil(element.distance.value / 1000);
    const zona = await this.findZoneByDistance(distanciaKm);

    if (!zona) {
      throw new NotFoundException(`No se encontró zona para ${distanciaKm} km`);
    }

    return {
      distanciaKm,
      zona,
      ciudadOrigen: distanceRes.data.origin_addresses?.[0] ?? '',
      ciudadDestino: distanceRes.data.destination_addresses?.[0] ?? '',
    };
  }

  private mapToResponseDto(rate: ShippingRate): ShippingRateResponseDto {
    return {
      id: rate.id,
      kgMin: rate.kgMin,
      kgMax: rate.kgMax,
      price: rate.price,
      zone: {
        id: rate.zone.id,
        name: rate.zone.zoneName,
        minDistance: rate.zone.minDistance,
        maxDistance: rate.zone.maxDistance,
      },
      service: {
        id: rate.service.id,
        name: rate.service.serviceName,
      },
    };
  }
  async getAllInternationalCountries() {
    return await this.countryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async getInternationalTariffByVolumetric(payload: {
    paisDestino: string;
    peso: number;
    largo: number;
    ancho: number;
    alto: number;
  }) {
    const { paisDestino, peso, largo, ancho, alto } = payload;

    const country = await this.internationalCountryRepository.findOne({
      where: { name: paisDestino },
      relations: ['zone'],
    });

    if (!country || !country.zone) {
      throw new NotFoundException('País o zona no encontrada');
    }

    const pesoVol = +(largo * alto * ancho / 5000).toFixed(2);
    const pesoFacturable = Math.max(peso, pesoVol);

    const tarifa = await this.tariffRepository.findOne({
      where: {
        zone: { id: country.zone.id },
        max_kg: MoreThanOrEqual(pesoFacturable), // corregido
      },
      order: { max_kg: 'ASC' }, // corregido
    });

    if (!tarifa) {
      throw new NotFoundException('No se encontró tarifa para ese peso');
    }

    const adicional = 0;
    const subtotal = tarifa.base_price + adicional; // corregido
    const iva = +(subtotal * (tarifa.iva_percent / 100)).toFixed(2); // corregido
    const total = +(subtotal + iva).toFixed(2);

    return {
      zona: country.zone.code,
      descripcionZona: country.zone.description,
      pesoFisico: peso,
      pesoVolumetrico: pesoVol,
      pesoCobrado: pesoFacturable,
      precioBase: tarifa.base_price,
      iva,
      total,
    };
  }



  // servicio de paises
  async findCountryInfo(paisDestino: string) {
    const country = await this.countryRepository.findOne({
      where: { name: paisDestino },
      relations: ['zone'],
    });

    if (!country) {
      throw new NotFoundException('País no encontrado');
    }

    return {
      pais: country.name,
      zona: country.zone.code,
      descripcionZona: country.zone.description,
    };
  }
}
