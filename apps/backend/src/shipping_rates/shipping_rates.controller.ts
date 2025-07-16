import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ShippingRateService } from './shipping_rates.service';
import {
  CreateShippingRateDto,
  UpdateShippingRateDto,
  GetShippingRateDto,
  CalculateShippingResponseDto,
  ShippingRateResponseDto,
} from './dto/create-shipping_rate.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InternationalCountry } from './entities/international-country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Controller('shipping-rates')
export class ShippingRateController {
  constructor(
    private readonly shippingRateService: ShippingRateService,
    private readonly httpService: HttpService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createShippingRateDto: CreateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.create(createShippingRateDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createMany(
    @Body(ValidationPipe) createShippingRateDtos: CreateShippingRateDto[],
  ): Promise<ShippingRateResponseDto[]> {
    return this.shippingRateService.createMany(createShippingRateDtos);
  }

  @Get()
  async findAll(): Promise<ShippingRateResponseDto[]> {
    return this.shippingRateService.findAll();
  }
  @Post('consultar-pais')
  async consultarPais(@Body() body: any) {
    const { paisDestino } = body;

    if (!paisDestino) {
      throw new BadRequestException('El país destino es obligatorio');
    }

    return await this.shippingRateService.findCountryInfo(paisDestino);
  }


  @Get('paises-internacionales')
  async getInternationalCountries() {
    return this.shippingRateService.getAllInternationalCountries();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateShippingRateDto: UpdateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.update(id, updateShippingRateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.shippingRateService.remove(id);
  }

  // ✅ NUEVO: Calcular distancia entre dos CP y encontrar zona
  @Post('calculate-distance')
  async calculateDistance(@Body() body: { codigoOrigen: string; codigoDestino: string }) {
    const { codigoOrigen, codigoDestino } = body;

    if (!codigoOrigen || !codigoDestino || codigoOrigen.length !== 5 || codigoDestino.length !== 5) {
      throw new Error('Ambos códigos postales deben tener 5 dígitos');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const getCoords = async (cp: string) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cp},MX&key=${apiKey}`;
      const res = await firstValueFrom(this.httpService.get(url));
      const location = res.data.results?.[0]?.geometry?.location;
      if (!location) throw new Error(`No se pudo geocodificar el CP: ${cp}`);
      return location;
    };

    try {
      const origen = await getCoords(codigoOrigen);
      const destino = await getCoords(codigoDestino);

      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&mode=driving&language=es&key=${apiKey}`;
      const distanceRes = await firstValueFrom(this.httpService.get(distanceUrl));
      const element = distanceRes.data.rows?.[0]?.elements?.[0];

      if (element?.status !== 'OK') {
        throw new Error('No se pudo calcular la distancia entre los CP');
      }

      const distanciaKm = Math.ceil(element.distance.value / 1000);
      const zona = await this.shippingRateService.findZoneByDistance(distanciaKm);

      if (!zona) {
        throw new Error(`No se encontró zona para ${distanciaKm} km`);
      }

      return {
        codigoOrigen,
        codigoDestino,
        ciudadOrigen: distanceRes.data.origin_addresses?.[0] ?? '',
        ciudadDestino: distanceRes.data.destination_addresses?.[0] ?? '',
        distancia: element.distance.text,
        duracion: element.duration.text,
        distanciaKm,
        zona: {
          id: zona.id,
          nombre: zona.zoneName,
          minKm: zona.minDistance,
          maxKm: zona.maxDistance,
        },
      };
    } catch (error) {
      throw new Error('Error al calcular la distancia: ' + error.message);
    }
  }

  // Cotizar MEXPOST
  @Post('cotizar')
  async cotizarEnvio(@Body() body: {
    peso: number;
    alto: number;
    ancho: number;
    largo?: number;
    codigoOrigen?: string;
    codigoDestino?: string;
    tipoServicio: string;
  }) {
    const { peso, alto, ancho, largo = 1, codigoOrigen, codigoDestino, tipoServicio } = body;

    if (!peso || !alto || !ancho || !codigoOrigen || !codigoDestino) {
      throw new BadRequestException('Peso, alto, ancho y códigos postales son obligatorios');
    }

    if (peso <= 0 || alto <= 0 || ancho <= 0) {
      throw new BadRequestException('Dimensiones y peso deben ser mayores a cero');
    }

    const largoUsado = largo || 1;
    const pesoVolumetrico = (largoUsado * alto * ancho) / 6000;
    const pesoParaCobro = Math.max(peso, pesoVolumetrico);


    const datosDistancia = await this.shippingRateService.getDatosZonaYDistancia(
      codigoOrigen,
      codigoDestino
    );

    if (!datosDistancia) {
      throw new NotFoundException('No se pudo encontrar la zona para los códigos proporcionados');
    }

    const zonaId = datosDistancia.zona.id;
    const servicioId = 1;

    const tarifa = await this.shippingRateService.findTarifa(zonaId, servicioId, pesoParaCobro);

    if (!tarifa || tarifa.price == null) {
      throw new NotFoundException('No se encontró tarifa válida');
    }

    const precioConIVA = Number(tarifa.price);
    if (isNaN(precioConIVA)) {
      throw new BadRequestException('La tarifa obtenida no es un número válido');
    }

    const precioSinIVA = +(precioConIVA / 1.16);
    const ivaCalculado = +(precioConIVA - precioSinIVA);

    return {
      pesoFisico: +peso.toFixed(2),
      pesoVolumetrico: +pesoVolumetrico.toFixed(3),
      tarifaSinIVA: +precioSinIVA.toFixed(2),
      iva: +ivaCalculado.toFixed(2),
      costoTotal: +precioConIVA.toFixed(2),
      mensaje: 'El total incluye 16% de IVA',
    };
  }
  @Post('cotizar-internacional')
  async cotizarInternacional(@Body() body: {
    paisDestino: string;
    peso: number;
    largo: number;
    ancho: number;
    alto: number;
  }) {
    if (!body.paisDestino || !body.peso || !body.largo || !body.ancho || !body.alto) {
      throw new BadRequestException('Faltan parámetros obligatorios');
    }

    return await this.shippingRateService.getInternationalTariffByVolumetric(body);
  }



  @Post('tarifa-internacional')
  async getTarifaInternacional(
    @Body() body: { paisDestino: string; peso: number },
  ) {
    const { paisDestino, peso } = body;

    if (!paisDestino || !peso || peso <= 0) {
      throw new BadRequestException('Debes enviar un país destino y un peso válido');
    }

    try {
      const resultado = await this.shippingRateService.getInternationalTariff(
        paisDestino,
        peso,
      );
      return resultado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('❌ Error en la consulta de tarifa internacional:', error.message);
      throw new BadRequestException('No se pudo calcular la tarifa internacional');
    }
  }


  //Busqueda de Pais




  // (Opcional) Agrega aquí otros endpoints si defines búsqueda por zona, service, etc.
}
