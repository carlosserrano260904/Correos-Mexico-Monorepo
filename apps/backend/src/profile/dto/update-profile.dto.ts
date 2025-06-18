// src/profile/dto/update-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    example: 'https://bucket.s3.amazonaws.com/images/abc123.jpg',
    description: 'URL pública del avatar',
  })
  @IsString()
  @IsOptional()
  imagen?: string;
}
