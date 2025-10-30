import { 
  Controller, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe, 
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin') //Define la ruta base: /api/admin
export class AdminController {
  
  //Este servicio contendrá la lógica 
  constructor(private readonly adminService: AdminService) {}

  @Get('users') //Endpoint para obtener todos los usuarios
  async getAllUsers() {
    //Buscar y devolver todos los usuarios
    return this.adminService.findAllUsers();
  }
    //Enpoint para actualizar el rol de un usuario
  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number, // Obtiene el 'id' de la URL y lo convierte a número
    @Body() updateUserRoleDto: UpdateUserRoleDto, // Obtiene los datos del body (ej. { "rol": "vendedor" })
  ) {
    const { rol } = updateUserRoleDto;
    return this.adminService.updateUserRole(id, rol);
  }

  //Endpoint para eliminar un usuario.
  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código 204 (Sin Contenido) si tiene éxito
  async deleteUser(
    @Param('id', ParseIntPipe) id: number, // Obtiene el 'id' de la URL
  ) {
    return this.adminService.deleteUser(id);
  }
}