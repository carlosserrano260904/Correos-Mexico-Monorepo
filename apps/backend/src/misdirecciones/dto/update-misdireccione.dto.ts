import { PartialType } from '@nestjs/mapped-types';
import { CreateMisdireccioneDto } from './create-misdireccione.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMisdireccioneDto extends PartialType(CreateMisdireccioneDto) {
}
