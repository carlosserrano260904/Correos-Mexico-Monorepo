import { Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus, 
  BadRequestException, 
  Logger} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('upload-image')
@Controller('upload-image')
export class UploadImageController {
  private readonly logger = new Logger(UploadImageController.name)
  constructor(private readonly uploadService: UploadImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBody({
    description: 'Sube una o más imágenes (límite de 10 por petición)',
    schema:{
      type: 'object',
      properties:{
        images: {
          type: 'array',
          items: {type: 'string', format: 'binary'},
          description: 'Los archivos de imagen a subir',
        },
      },
      required: ['images'],
    },
  })
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) {
      throw new BadRequestException('No file uploaded');
    }
    this.logger.log(`Recibidos ${files.length} archivos para subir.`)

    const uploadPromises = files.map((file) => this.uploadService.uploadFileImage(file),
  );

    try{
      const urls = await Promise.all(uploadPromises);
      this.logger.log('Archivos subidos exitosamente.',urls);

      //Devuelve un objeto con un array de URLs, listo para front.
      return { urls };
    }catch(error){
      this.logger.error('Error al subir archivos.',error.stack);
      throw new HttpException('Error al subir las imágenes.',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}