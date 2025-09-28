import { PartialType } from '@nestjs/mapped-types';
import { CreateOficinaDto } from './create-oficina.dto';

export class UpdateOficinaDto extends PartialType(CreateOficinaDto) {}
