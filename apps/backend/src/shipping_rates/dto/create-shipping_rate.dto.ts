import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para crear una nueva tarifa de envío
export class CreateShippingRateDto {
  @IsNumber() // Valida que sea número
  @Min(0) // Mínimo permitido es 0
  @Type(() => Number) // Transforma el valor a número
  kgMin: number; // Peso mínimo del rango

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kgMax: number; // Peso máximo del rango

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number; // Precio de la tarifa

  @IsNumber()
  @Type(() => Number)
  zoneId: number; // ID de la zona

  @IsNumber()
  @Type(() => Number)
  serviceId: number; // ID del servicio
}

// DTO para actualizar una tarifa de envío (todos los campos son opcionales)
export class UpdateShippingRateDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kgMin?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kgMax?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @Type(() => Number)
  zoneId?: number;

  @IsNumber()
  @Type(() => Number)
  serviceId?: number;
}

// DTO para obtener una tarifa de envío según parámetros de consulta
export class GetShippingRateDto {
  @IsString()
  @IsIn(['dia_siguiente', 'dos_dias', 'estandar']) // Solo permite estos valores
  serviceType: string; // Tipo de servicio

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weight: number; // Peso del paquete

  @IsString()
  @IsIn(['zona_a', 'zona_b', 'zona_c', 'zona_d', 'zona_e', 'zona_f', 'zona_g']) // Solo permite estas zonas
  zone: string; // Zona de envío

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  distanceKm?: number; // Distancia en kilómetros (opcional)
}

// DTO para la respuesta de una tarifa de envío
export class ShippingRateResponseDto {
  id: number; // ID de la tarifa
  kgMin: number; // Peso mínimo
  kgMax: number; // Peso máximo
  price: number; // Precio
  zone: {
    // Información de la zona
    id: number;
    name: string;
    minDistance: number;
    maxDistance: number | null;
  };
  service: {
    // Información del servicio
    id: number;
    name: string;
  };
}

// DTO para la respuesta del cálculo de tarifa de envío
export class CalculateShippingResponseDto {
  rate: number; // Tarifa calculada
  weight: number; // Peso del paquete
  zoneId: number; // ID de la zona
  serviceId: number; // ID del servicio
  weightRange: {
    // Rango de peso aplicado
    from: number;
    to: number;
  };
}
