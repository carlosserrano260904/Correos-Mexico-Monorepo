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
  async documentHtml(@Query('key') key: string, @Res() res: Response) {
    if (!key) {
      throw new HttpException(
        'Falta el parámetro ?key=',
        HttpStatus.BAD_REQUEST,
      );
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

  @Get('terminos-web-html')
  async terminosWebHtml(@Res() res: Response) {
    const key = 'docs/TÉRMINOS Y CONDICIONES DE USO WEB.docx';
    try {
      const html = await this.docsService.getHtmlFromDocx(key);
      res.type('text/html');
      return res.send(html);
    } catch (error) {
      this.logger.error(
        'Error al convertir Términos WEB DOCX a HTML',
        error.stack || error,
      );
      throw new HttpException(
        error?.message || 'Error interno al convertir los términos WEB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('aviso-web-html')
  async avisoWebHtml(@Res() res: Response) {
    const key = 'docs/AVISO DE PRIVACIDAD CORREOS.docx';
    try {
      const html = await this.docsService.getHtmlFromDocx(key);
      res.type('text/html');
      return res.send(html);
    } catch (error) {
      this.logger.error(
        'Error al convertir Aviso WEB DOCX a HTML',
        error.stack || error,
      );
      throw new HttpException(
        error?.message || 'Error interno al convertir el aviso WEB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('arco-web-html')
  async arcoWebHtml(@Res() res: Response) {
    const key = 'docs/Propuesta_Derechos-ARCO.docx';
    try {
      const html = await this.docsService.getHtmlFromDocx(key);
      res.type('text/html');
      return res.send(html);
    } catch (error) {
      this.logger.error(
        'Error al convertir ARCO WEB DOCX a HTML',
        error.stack || error,
      );
      throw new HttpException(
        error?.message || 'Error interno al convertir el ARCO WEB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
