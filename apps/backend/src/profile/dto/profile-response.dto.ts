// src/profile/dto/profile-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ example: 1, description: 'ID único del perfil' })
  id: number;

  @ApiProperty({ example: 'Cristian', description: 'Nombre del usuario' })
  nombre: string;

  @ApiProperty({ example: 'Torres', description: 'Apellido del usuario' })
  apellido: string;

  @ApiProperty({
    example: '6182538020',
    description: 'Número telefónico del usuario',
  })
  numero: string;

  @ApiProperty({ example: 'Durango', description: 'Estado de origen' })
  estado: string;

  @ApiProperty({ example: 'Durango', description: 'Ciudad de origen' })
  ciudad: string;

  @ApiProperty({
    example: 'Los Encinos',
    description: 'Fraccionamiento o colonia',
  })
  fraccionamiento: string;

  @ApiProperty({ example: 'Calle Ejemplo', description: 'Calle' })
  calle: string;

  @ApiProperty({
    example: '34227',
    description: 'Código postal',
  })
  codigoPostal: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../default_nlbjlp.jpg',
    description: 'URL de la imagen de avatar',
  })
  imagen: string;
}
