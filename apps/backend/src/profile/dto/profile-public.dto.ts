// src/profile/dto/profile-public.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProfilePublicDto {
  @ApiProperty({ example: 7 }) id: number;
  @ApiProperty({ example: 'Ana' }) nombre: string;
  @ApiProperty({ example: 'López' }) apellido: string;
  @ApiProperty({ example: 'https://.../avatar.jpg', nullable: true }) imagen?:
    | string
    | null;
}
