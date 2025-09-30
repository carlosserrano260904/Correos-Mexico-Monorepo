// src/profile/dto/update-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    example: 'uploads/user-25/avatar-abc123.jpg',
    description:
      'Key del archivo en el servidor o S3 (no la URL firmada). Se actualiza solo si se envía.',
  })
  @IsOptional()
  @IsString()
  imagen?: string;
}
