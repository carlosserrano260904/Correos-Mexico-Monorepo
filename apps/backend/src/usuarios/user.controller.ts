import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Usuarios } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [Usuarios] })
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: Usuarios })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id') //Endpoint para obtener un usuario api/users/:id
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Usuarios })
  async findById(@Param('id', ParseIntPipe) id: number) {
    // Obtiene el 'id' de la URL y lo convierte a número
    return this.userService.findById(id); //Pasa id al servicio para buscar el usuario
  }

  @Patch('role/:id') // api/users/:id/role
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol de usuario actualizado', type: Usuarios })
    async updateUserRole(
      @Param('id', ParseIntPipe) id: number, // Obtiene el 'id' de la URL y lo convierte a número
      @Body() updateUserRoleDto: UpdateUserRoleDto, // Obtiene los datos del body (ej. { "rol": "vendedor" })
    ) {
      const { rol } = updateUserRoleDto;
      return this.userService.updateUserRole(id, rol);
    }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const { rol } = updateUserRoleDto;
    return this.userService.updateUserRole(id, rol);
  }

}
