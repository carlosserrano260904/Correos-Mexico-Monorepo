import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritoDto } from './create-carrito.dto';

export class UpdateCarritoDto extends PartialType(CreateCarritoDto) {}
