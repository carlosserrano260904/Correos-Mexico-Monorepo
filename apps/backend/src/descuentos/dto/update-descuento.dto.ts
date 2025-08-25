import { PartialType } from '@nestjs/swagger';
import { CreateDescuentoDto } from './create-descuento.dto';

export class UpdateDescuentoDto extends PartialType(CreateDescuentoDto) {}
