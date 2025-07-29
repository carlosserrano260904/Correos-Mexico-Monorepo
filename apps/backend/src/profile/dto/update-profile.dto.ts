import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    example: 'images/abc123-avatar.jpg',
    description: 'Key del archivo en S3, no una URL',
  })
  @IsString()
  @IsOptional()
  imagen?: string;
}