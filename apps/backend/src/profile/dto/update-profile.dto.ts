import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    example: 'uploads/user-25/avatar-abc123.jpg',
    description: 'Key del archivo en el servidor o S3 (no la URL firmada)',
  })
  @IsOptional()
  @IsString()
  imagen?: string;
}