import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MisdireccionesService } from './misdirecciones.service';
import { CreateMisdireccioneDto } from './dto/create-misdireccione.dto';
import { UpdateMisdireccioneDto } from './dto/update-misdireccione.dto';

@ApiTags('Misdirecciones') // Agrupa en Swagger bajo este nombre
@Controller('misdirecciones')
export class MisdireccionesController {
  constructor(private readonly misdireccionesService: MisdireccionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva dirección del usuario' })
  @ApiBody({ type: CreateMisdireccioneDto })
  @ApiResponse({ status: 201, description: 'Dirección creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createMisdireccioneDto: CreateMisdireccioneDto) {
    return this.misdireccionesService.create(createMisdireccioneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiResponse({ status: 200, description: 'Listado de direcciones.' })
  findAll() {
    return this.misdireccionesService.findAll();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener direcciones por ID de usuario' })
  @ApiParam({ name: 'usuarioId', type: Number, description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Direcciones del usuario encontradas.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findByUsuario(@Param('usuarioId') usuarioId: number) {
    return this.misdireccionesService.obtenerPorUsuario(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una dirección por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la dirección' })
  @ApiResponse({ status: 200, description: 'Dirección encontrada.' })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.misdireccionesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una dirección por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la dirección' })
  @ApiBody({ type: UpdateMisdireccioneDto })
  @ApiResponse({ status: 200, description: 'Dirección actualizada.' })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada.' })
  update(
    @Param('id') id: string,
    @Body() updateMisdireccioneDto: UpdateMisdireccioneDto,
  ) {
    return this.misdireccionesService.update(+id, updateMisdireccioneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una dirección por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la dirección' })
  @ApiResponse({ status: 200, description: 'Dirección eliminada.' })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada.' })
  remove(@Param('id') id: string) {
    return this.misdireccionesService.remove(+id);
  }
}
