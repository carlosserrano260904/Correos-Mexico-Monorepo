import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgregarClaveZonaDto {
  @ApiProperty({
    example: '00304',
    description: 'Clave de la zona a agregar a la oficina',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 5, { message: 'La claveZona debe tener exactamente 5 caracteres' })
  @Matches(/^\d{5}$/, { message: 'La claveZona debe contener solo números' })

  claveZona: string;
}


