// src/profile/profile.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { ProfileService } from './profile.service';
import { UploadImageService } from '../upload-image/upload-image.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Perfiles')
@ApiBearerAuth() // si usas guardas JWT
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly uploadImageService: UploadImageService,  // <-- Inyección añadida
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo perfil' })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado correctamente',
    type: ProfileResponseDto,
  })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  @ApiOkResponse({
    description: 'Arreglo de perfiles',
    type: ProfileResponseDto,
    isArray: true,
  })
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del perfil',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del perfil',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Perfil actualizado correctamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar perfil por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del perfil',
    example: 1,
  })
  @ApiResponse({ status: 204, description: 'Perfil eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Subir avatar de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpg, png)',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Avatar actualizado correctamente',
    schema: {
      example: { url: 'https://.../avatar-abc123.jpg' },
    },
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const publicUrl = await this.uploadImageService.uploadFileImage(file);
    await this.profileService.updateAvatar(+id, publicUrl);
    return { url: publicUrl };
  }
}
