// src/admin/dto/update-user-role.dto.ts

import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  
  @IsString()
  @IsNotEmpty()
  @IsIn(['usuario', 'vendedor', 'admin']) // Limita los roles a valores válidos
  rol: string;
  
}