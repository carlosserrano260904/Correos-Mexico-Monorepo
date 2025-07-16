import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';  
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
//import { UploadImageService } from 'src/upload-image/upload-image.service';
import { memoryStorage } from 'multer';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    //private readonly uploadImageService: UploadImageService
  ) {}

  @Post()
  @ApiOperation({summary:'Creacion de un nuevo perfil en base a un login'})
  @ApiResponse({status:201,description:'Perfil creado correctamente'})
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({summary:'Lista de todos los perfiles'})
  @ApiOkResponse({
    description:'Arreglo de todos los perfiles',
    type:CreateProfileDto,
    isArray:true
  })
  @ApiInternalServerErrorResponse({description:'Error interno del servidor'})
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary:'Obtener un perfil por su ID'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del perfil',
    example:1

  })
  @ApiOkResponse({
    description:'Perfil encontrado',
    type:CreateProfileDto
  })
  @ApiResponse({status:200,description:'Perfil encontrado'})
  @ApiResponse({status:404,description:'Perfil no encontrado'})
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary:'Actualizar un perfil por su ID'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del perfil',
    example:1
  })
  @ApiResponse({
    status:200,
    description:'Perfil actualizado correctamente',
    type:CreateProfileDto
  })
  @ApiResponse({status:404,description:'Perfil no encontrado'})
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({summary:'Eliminar perfil por su ID'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del perfil',
    example:1
  })
  @ApiResponse({status:204,description:'Perfil eliminado correctamente'})
  @ApiResponse({status:404,description:'Perfil no encontrado'})

  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 1) Sube a S3
    //const url = await this.uploadImageService.uploadFile(file);

    // 2) Actualiza sólo el campo `imagen` en la base
    //const actualizado = await this.profileService.updateAvatar(id, url);

    //return { avatarUrl: actualizado.imagen }; temporalmente comentado
  }
}
