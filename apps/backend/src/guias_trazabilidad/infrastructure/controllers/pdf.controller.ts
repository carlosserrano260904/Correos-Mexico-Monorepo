import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { pdf } from '@react-pdf/renderer';
import { plantillaGuiaInternacional } from '../pdf-generator/plantillas/guia-plantilla-internacional';
import { plantillaGuiaNacional } from '../pdf-generator/plantillas/guia-plantilla-nacional';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('PDF')
@Controller('pdf')
export class PdfController {

  // ! ESTE CONTROLLER ES HARDCODE, SOLO ES PARA IR PROBANDO LA PLANTILLA Y CAMBIANDO SU ESTILO
  @Get('test-pdf')
  @ApiOperation({ summary: 'Genera un PDF de prueba con datos dummy usando la plantilla basica' })
  @ApiResponse({ status: 200, description: 'PDF generado exitosamente' })
  async generarPDFPrueba(@Res() res: Response) {
    try {
      // datos dummyu, simulacion del payload real
      const datosPrueba = {
        numeroRastreo: 'TEST123456789MX',
        valorDeclarado: 1500.50,
        embalaje: {
          alto: '30',
          ancho: '25',
          largo: '15',
          peso: '2.5'
        },
        remitente: {
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
          TelefonoVO: '5551234567',
          direccion: {
            calle: 'Av. Reforma',
            numero: '123',
            numeroInterior: '4B',
            asentamiento: 'Juárez',
            codigoPostal: '06600',
            localidad: 'Ciudad de México',
            estado: 'CDMX',
            pais: 'México',
            referencia: 'Frente al Starbucks'
          }
        },
        destinatario: {
          nombres: 'María Elena',
          apellidos: 'González López',
          TelefonoVO: '5559876543',
          direccion: {
            calle: 'Calle Insurgentes',
            numero: '456',
            numeroInterior: '',
            asentamiento: 'Centro',
            codigoPostal: '44100',
            localidad: 'Guadalajara',
            estado: 'Jalisco',
            pais: 'México',
            referencia: 'Junto a la farmacia'
          }
        }
      };

      // qr dummy
      const qrDummy = 'hola soy un qr'

      // generando pdf
      const pdfDocument = plantillaGuiaNacional(datosPrueba, qrDummy);

      // la versioon que descargue tiene un bug, hay que usarla entonces asi
      const pdfBlob = await pdf(pdfDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
      // const pdfBuffer = await pdf(pdfDocument).toBuffer(); // <-- bug

      const fileName = `guia-prueba-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;

      // headers
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generando PDF de prueba:', error);
      res.status(500).json({ 
        error: 'Error generando PDF de prueba',
        details: error.message 
      });
    }
  }
}