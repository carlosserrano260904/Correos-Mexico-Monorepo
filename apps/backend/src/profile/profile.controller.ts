import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo perfil' })
  @ApiResponse({ status: 201, description: 'Perfil creado correctamente' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  @ApiOkResponse({
    description: 'Arreglo de perfiles',
    type: CreateProfileDto,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil', example: 1 })
  @ApiOkResponse({ description: 'Perfil encontrado', type: CreateProfileDto })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil', example: 1 })
  @ApiResponse({ status: 200, description: 'Perfil actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar perfil por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil', example: 1 })
  @ApiResponse({ status: 204, description: 'Perfil eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Subir avatar de perfil' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil', example: 1 })
  @ApiOkResponse({ description: 'Avatar actualizado correctamente' })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const publicUrl = await this.uploadImageService.uploadFileImage(file);
    await this.profileService.updateAvatar(+id, publicUrl);
    return { url: publicUrl };
  }
}