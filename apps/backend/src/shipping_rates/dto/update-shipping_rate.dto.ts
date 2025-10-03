import { PartialType } from '@nestjs/mapped-types'; // Importa PartialType para crear DTOs con campos opcionales
import { CreateShippingRateDto } from './create-shipping_rate.dto'; // Importa el DTO base para crear tarifas de envío

// Define el DTO para actualizar una tarifa de envío.
// Extiende de CreateShippingRateDto, pero todos los campos pasan a ser opcionales gracias a PartialType.
export class UpdateShippingRateDto extends PartialType(CreateShippingRateDto) {}
