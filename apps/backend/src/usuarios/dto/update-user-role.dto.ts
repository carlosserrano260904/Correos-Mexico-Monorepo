import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  
  @IsString()
  @IsNotEmpty()
  @IsIn(['usuario', 
    'vendedor', 
    'administrador-general',
    'administrador-paquetes',
    'administrador-ecommerce',
    'repartidor',
    'conductor',]) // Limita los roles a valores válidos
  rol: string;
}