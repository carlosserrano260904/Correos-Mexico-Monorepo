import { Controller, Post, Res } from '@nestjs/common';
import { EjemploUsarGuiasService } from './ejemploUsarGuias.service';
import { Response } from 'express';

@Controller('ejemplo-usar-guias')
export class EjemploUsarGuiasController {
  constructor(
    private readonly ejemploUsarGuiasService: EjemploUsarGuiasService,
  ) {}

  // este fichero lo hice para ver en postman que si funciona la importacion del modulo de guias_trazabilidad
  @Post('crear-guia')
  async crearGuia(@Res() res: Response) {
    const result = await this.ejemploUsarGuiasService.crearGuia();

    const fileName = `guia-${result.numeroRastreo}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': result.pdf.length,
    });

    res.send(result.pdf);
  }
}
