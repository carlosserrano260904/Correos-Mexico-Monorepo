import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
// --- 👇 CORRECCIÓN: Ruta de importación actualizada ---
import { CreateUserDto } from '../auth/dto/create-user.dto'; 
import { CreateAccount } from 'src/create-account/entities/create-account.entity'; // Importa la entidad correcta
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users') // Etiqueta de Swagger
@Controller('users') // Ruta base /api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  // Devuelve un array de 'CreateAccount' (la entidad real)
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [CreateAccount] }) 
  findAll() {
    // Llama al método del servicio (que usa 'CreateAccount')
    return this.userService.findAll(); 
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  // Devuelve un 'CreateAccount'
  @ApiResponse({ status: 201, description: 'Usuario creado', type: CreateAccount }) 
  create(@Body() createUserDto: CreateUserDto) {
    // Pasa el DTO al servicio (que espera Partial<CreateAccount>)
    // Esto funciona porque CreateUserDto es compatible
    return this.userService.create(createUserDto); 
  }
}