import { PartialType } from '@nestjs/swagger';
import { CreateMisdireccioneDto } from './create-misdireccione.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMisdireccioneDto extends PartialType(
  CreateMisdireccioneDto,
) {}
