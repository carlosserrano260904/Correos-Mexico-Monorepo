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
} from '@nestjs/common'; // Importa decoradores y utilidades de NestJS para definir rutas y manejar peticiones
import { ShippingRateService } from './shipping_rates.service'; // Importa el servicio que contiene la lógica de negocio
import {
  CreateShippingRateDto,
  UpdateShippingRateDto,
  GetShippingRateDto,
  CalculateShippingResponseDto,
  ShippingRateResponseDto,
} from './dto/create-shipping_rate.dto'; // Importa los DTOs usados para validar y tipar datos
import { HttpService } from '@nestjs/axios'; // Permite hacer peticiones HTTP externas
import { firstValueFrom } from 'rxjs'; // Convierte un Observable en una Promesa
import { BadRequestException, NotFoundException } from '@nestjs/common'; // Excepciones para errores HTTP
import { InternationalCountry } from './entities/international-country.entity'; // Entidad para países internacionales
import { InjectRepository } from '@nestjs/typeorm'; // Decorador para inyectar repositorios TypeORM
import { Repository } from 'typeorm'; // Clase base para repositorios TypeORM

// Define el controlador para la ruta 'shipping-rates'
@Controller('shipping-rates')
export class ShippingRateController {
  // Constructor: inyecta el servicio de tarifas y el servicio HTTP
  constructor(
    private readonly shippingRateService: ShippingRateService,
    private readonly httpService: HttpService,
  ) { }

  // Endpoint para crear una tarifa de envío
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createShippingRateDto: CreateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.create(createShippingRateDto);
  }

  // Endpoint para crear varias tarifas de envío en lote
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createMany(
    @Body(ValidationPipe) createShippingRateDtos: CreateShippingRateDto[],
  ): Promise<ShippingRateResponseDto[]> {
    return this.shippingRateService.createMany(createShippingRateDtos);
  }

  // Endpoint para obtener todas las tarifas de envío
  @Get()
  async findAll(): Promise<ShippingRateResponseDto[]> {
    return this.shippingRateService.findAll();
  }

  // Endpoint para consultar información de un país internacional
  @Post('consultar-pais')
  async consultarPais(@Body() body: any) {
    const { paisDestino } = body;

    if (!paisDestino) {
      throw new BadRequestException('El país destino es obligatorio');
    }

    return await this.shippingRateService.findCountryInfo(paisDestino);
  }

  // Endpoint para obtener todos los países internacionales disponibles
  @Get('paises-internacionales')
  async getInternationalCountries() {
    return this.shippingRateService.getAllInternationalCountries();
  }

  // Endpoint para obtener una tarifa de envío por ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.findOne(id);
  }

  // Endpoint para actualizar una tarifa de envío por ID
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateShippingRateDto: UpdateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    return this.shippingRateService.update(id, updateShippingRateDto);
  }

  // Endpoint para eliminar una tarifa de envío por ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.shippingRateService.remove(id);
  }

  // Endpoint para calcular la distancia entre dos códigos postales y encontrar la zona correspondiente
  @Post('calculate-distance')
  async calculateDistance(@Body() body: { codigoOrigen: string; codigoDestino: string }) {
    const { codigoOrigen, codigoDestino } = body;

    // Validación de los códigos postales
    if (!codigoOrigen || !codigoDestino || codigoOrigen.length !== 5 || codigoDestino.length !== 5) {
      throw new Error('Ambos códigos postales deben tener 5 dígitos');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Función interna para obtener coordenadas de un CP usando Google Maps
    const getCoords = async (cp: string) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cp},MX&key=${apiKey}`;
      const res = await firstValueFrom(this.httpService.get(url));
      const location = res.data.results?.[0]?.geometry?.location;
      if (!location) throw new Error(`No se pudo geocodificar el CP: ${cp}`);
      return location;
    };

    try {
      // Obtiene coordenadas de origen y destino
      const origen = await getCoords(codigoOrigen);
      const destino = await getCoords(codigoDestino);

      // Calcula la distancia entre ambos puntos usando Google Maps Distance Matrix
      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&mode=driving&language=es&key=${apiKey}`;
      const distanceRes = await firstValueFrom(this.httpService.get(distanceUrl));
      const element = distanceRes.data.rows?.[0]?.elements?.[0];

      if (element?.status !== 'OK') {
        throw new Error('No se pudo calcular la distancia entre los CP');
      }

      // Calcula la distancia en kilómetros y busca la zona correspondiente
      const distanciaKm = Math.ceil(element.distance.value / 1000);
      const zona = await this.shippingRateService.findZoneByDistance(distanciaKm);

      if (!zona) {
        throw new Error(`No se encontró zona para ${distanciaKm} km`);
      }

      // Retorna los datos calculados
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

  // Endpoint para cotizar un envío nacional (MEXPOST)
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

    // Validación de parámetros obligatorios
    if (!peso || !alto || !ancho || !codigoOrigen || !codigoDestino) {
      throw new BadRequestException('Peso, alto, ancho y códigos postales son obligatorios');
    }

    if (peso <= 0 || alto <= 0 || ancho <= 0) {
      throw new BadRequestException('Dimensiones y peso deben ser mayores a cero');
    }

    // Calcula el peso volumétrico y el peso para cobro
    const largoUsado = largo || 1;
    const pesoVolumetrico = (largoUsado * alto * ancho) / 6000;
    const pesoParaCobro = Math.max(peso, pesoVolumetrico);


    // Obtiene datos de zona y distancia
    const datosDistancia = await this.shippingRateService.getDatosZonaYDistancia(
      codigoOrigen,
      codigoDestino
    );

    if (!datosDistancia) {
      throw new NotFoundException('No se pudo encontrar la zona para los códigos proporcionados');
    }

    const zonaId = datosDistancia.zona.id;
    const servicioId = 1;

    // Busca la tarifa correspondiente
    const tarifa = await this.shippingRateService.findTarifa(zonaId, servicioId, pesoParaCobro);

    if (!tarifa || tarifa.price == null) {
      throw new NotFoundException('No se encontró tarifa válida');
    }

    // Calcula el precio con y sin IVA
    const precioConIVA = Number(tarifa.price);
    if (isNaN(precioConIVA)) {
      throw new BadRequestException('La tarifa obtenida no es un número válido');
    }

    const precioSinIVA = +(precioConIVA / 1.16);
    const ivaCalculado = +(precioConIVA - precioSinIVA);

    // Retorna los datos de la cotización
    return {
      pesoFisico: +peso.toFixed(2),
      pesoVolumetrico: +pesoVolumetrico.toFixed(3),
      tarifaSinIVA: +precioSinIVA.toFixed(2),
      iva: +ivaCalculado.toFixed(2),
      costoTotal: +precioConIVA.toFixed(2),
      mensaje: 'El total incluye 16% de IVA',
    };
  }

  // Endpoint para cotizar un envío internacional usando peso volumétrico
  @Post('cotizar-internacional')
  async cotizarInternacional(@Body() body: {
    paisDestino: string;
    peso: number;
    largo: number;
    ancho: number;
    alto: number;
  }) {
    // Validación de parámetros obligatorios
    if (!body.paisDestino || !body.peso || !body.largo || !body.ancho || !body.alto) {
      throw new BadRequestException('Faltan parámetros obligatorios');
    }

    // Llama al servicio para obtener la tarifa internacional
    return await this.shippingRateService.getInternationalTariffByVolumetric(body);
  }

  // Endpoint para obtener la tarifa internacional por país y peso
  @Post('tarifa-internacional')
  async getTarifaInternacional(
    @Body() body: { paisDestino: string; peso: number },
  ) {
    const { paisDestino, peso } = body;

    // Validación de parámetros
    if (!paisDestino || !peso || peso <= 0) {
      throw new BadRequestException('Debes enviar un país destino y un peso válido');
    }

    try {
      // Llama al servicio para obtener la tarifa internacional
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

  // Se pueden agregar otros endpoints para búsqueda por zona, servicio, etc.
}
