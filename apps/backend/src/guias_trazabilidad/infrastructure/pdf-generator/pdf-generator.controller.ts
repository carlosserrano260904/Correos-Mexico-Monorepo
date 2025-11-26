import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PDFGeneratorCreateService } from './pdf-generator-create.service';

@Controller('guias')
export class GuiaPdfController {
  constructor(
    private readonly pdfGeneratorCreateService: PDFGeneratorCreateService,
  ) {}

  @Post('generar-pdf-nacional')
  async generarPdfNacional(@Body() body, @Res() res: Response) {
    try {
      console.log('📨 Request recibido:', JSON.stringify(body, null, 2));

      const { remitente, destinatario, paquete, peso, valorDeclarado } = body;

      // Validación mejorada
      const errores: string[] = [];

      if (!remitente) errores.push('remitente es requerido');
      else {
        if (!remitente.nombres) errores.push('remitente.nombres es requerido');
        if (!remitente.apellidos)
          errores.push('remitente.apellidos es requerido');
        if (!remitente.telefono)
          errores.push('remitente.telefono es requerido');
        if (!remitente.direccion)
          errores.push('remitente.direccion es requerido');
        else {
          if (!remitente.direccion.calle)
            errores.push('remitente.direccion.calle es requerido');
          if (!remitente.direccion.numero)
            errores.push('remitente.direccion.numero es requerido');
          if (!remitente.direccion.codigoPostal)
            errores.push('remitente.direccion.codigoPostal es requerido');
        }
      }

      if (!destinatario) errores.push('destinatario es requerido');
      else {
        if (!destinatario.nombres)
          errores.push('destinatario.nombres es requerido');
        if (!destinatario.apellidos)
          errores.push('destinatario.apellidos es requerido');
        if (!destinatario.telefono)
          errores.push('destinatario.telefono es requerido');
        if (!destinatario.direccion)
          errores.push('destinatario.direccion es requerido');
        else {
          if (!destinatario.direccion.calle)
            errores.push('destinatario.direccion.calle es requerido');
          if (!destinatario.direccion.numero)
            errores.push('destinatario.direccion.numero es requerido');
          if (!destinatario.direccion.codigoPostal)
            errores.push('destinatario.direccion.codigoPostal es requerido');
        }
      }

      if (!paquete) errores.push('paquete es requerido');
      else {
        if (!paquete.alto_cm || isNaN(paquete.alto_cm))
          errores.push('paquete.alto_cm debe ser un número válido');
        if (!paquete.ancho_cm || isNaN(paquete.ancho_cm))
          errores.push('paquete.ancho_cm debe ser un número válido');
        if (!paquete.largo_cm || isNaN(paquete.largo_cm))
          errores.push('paquete.largo_cm debe ser un número válido');
      }

      if (!peso || isNaN(peso)) errores.push('peso debe ser un número válido');

      if (errores.length > 0) {
        console.error('❌ Errores de validación:', errores);
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Datos de entrada inválidos',
          detalles: errores,
        });
      }

      console.log('✅ Validación pasada, creando guía...');

      const result = await this.pdfGeneratorCreateService.crearGuiaConDatos(
        remitente,
        destinatario,
        paquete,
        peso,
        valorDeclarado || 0,
      );

      if (!result) {
        console.error('❌ El servicio retornó null/undefined');
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'El servicio no pudo procesar la solicitud',
        });
      }

      if (!result.pdf) {
        console.error('❌ No se generó el PDF:', result);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'No se pudo generar el PDF',
          detalles: result,
        });
      }

      console.log('✅ PDF generado exitosamente, tamaño:', result.pdf.length);
      console.log('📋 Número de rastreo:', result.numeroRastreo);

      const fileName = `guia-${result.numeroRastreo}.pdf`;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': result.pdf.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });

      return res.send(result.pdf);
    } catch (error) {
      console.error('💥 Error en generarPdfNacional:', error);
      console.error('Stack trace:', error.stack);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Error interno del servidor',
        mensaje: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
