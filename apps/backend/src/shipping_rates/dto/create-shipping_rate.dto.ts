
import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShippingRateDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kgMin: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kgMax: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  zoneId: number;

  @IsNumber()
  @Type(() => Number)
  serviceId: number;
}

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


export class GetShippingRateDto {
  @IsString()
  @IsIn(['dia_siguiente', 'dos_dias', 'estandar'])
  serviceType: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weight: number;

  @IsString()
  @IsIn(['zona_a', 'zona_b', 'zona_c', 'zona_d', 'zona_e', 'zona_f', 'zona_g'])
  zone: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  distanceKm?: number;
}

export class ShippingRateResponseDto {
  id: number;
  kgMin: number;
  kgMax: number;
  price: number;
  zone: {
    id: number;
    name: string;
    minDistance: number;
    maxDistance: number;
  };
  service: {
    id: number;
    name: string;
  };
}

export class CalculateShippingResponseDto {
  rate: number;
  weight: number;
  zoneId: number;
  serviceId: number;
  weightRange: {
    from: number;
    to: number;
  };
}
