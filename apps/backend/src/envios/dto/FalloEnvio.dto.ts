import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FalloEnvioDto {
  @ApiProperty({
    description: 'El motivo por el cual la entrega del envío ha fallado.',
    example: 'Cliente ausente',
  })
  @IsString()
  @IsNotEmpty()
  motivo_fallido: string;
}
