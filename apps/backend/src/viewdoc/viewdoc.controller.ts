import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ViewdocService } from './viewdoc.service';

@Controller()  
export class ViewdocController {
  private readonly logger = new Logger(ViewdocController.name);

  constructor(private readonly docsService: ViewdocService) {}

  @Get('document-html')
  async documentHtml(
    @Query('key') key: string,
    @Res() res: Response,
  ) {
    if (!key) {
      throw new HttpException('Falta el parámetro ?key=', HttpStatus.BAD_REQUEST);
    }

    try {
      const html = await this.docsService.getHtmlFromDocx(key);
      res.type('text/html');
      return res.send(html);
    } catch (error) {
      this.logger.error('Error al convertir DOCX a HTML', error.stack || error);
      throw new HttpException(
        error?.message || 'Error interno al convertir el documento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
