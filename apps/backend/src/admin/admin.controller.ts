import { 
  Controller, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe, 
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin') //Define la ruta base: /api/admin
export class AdminController {
  
  //Este servicio contendrá la lógica 
  constructor(private readonly adminService: AdminService) {}

  @Get('users') //Endpoint para obtener todos los usuarios api/admin/users
  async getAllUsers() {
    //Buscar y devolver todos los usuarios
    return this.adminService.findAllUsers();
  }
  @Get('users/:id') //Endpoint para obtener un usuario api/admin/users/:id
  async FindById(@Param('id', ParseIntPipe) id: number,) { // Obtiene el 'id' de la URL y lo convierte a número
    {
        return this.adminService.FindById(id); //Pasa id al servicio para buscar el usuario
    }
  }

    //Enpoint para actualizar el rol de un usuario
  @Patch('users/:id/role') // api/admin/users/:id/role
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number, // Obtiene el 'id' de la URL y lo convierte a número
    @Body() updateUserRoleDto: UpdateUserRoleDto, // Obtiene los datos del body (ej. { "rol": "vendedor" })
  ) {
    const { rol } = updateUserRoleDto;
    return this.adminService.updateUserRole(id, rol);
  }

  //Endpoint para eliminar un usuario falta ajustar a otro endpoint.
  /*@Delete('users/delete/:id') // api/admin/users/delete/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código 204 (Sin Contenido) si tiene éxito
  async deleteUser(
    @Param('id', ParseIntPipe) id: number, // Obtiene el 'id' de la URL
  ) {
    return this.adminService.deleteUser(id);
  }*/

  //Endpoint para crear usuarios
  @Post('users') // api/admin/users
  async createUser(
    @Body() createUserDto: any, // DTO para crear usuario (definir según necesidades)
  ) {
    // Lógica para crear un usuario (falta implementar en el servicio)
    return; // Retornar el usuario creado o algún mensaje
  }

}