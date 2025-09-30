import { IsNotEmpty } from 'class-validator';

export class CompletePasswordDto {
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
