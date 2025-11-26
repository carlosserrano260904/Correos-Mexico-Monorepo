import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Result } from '../../../utils/result';
import { QRGeneratorRepositoryInterface } from '../../application/ports/outbound/qr-generator.repository.interface';

// payload por si hay que agregar mas datos

@Injectable()
export class QRGeneratorRepository implements QRGeneratorRepositoryInterface {
  async generarQRComoDataURL(payload): Promise<Result<string>> {
    try {
      const qrData = payload;

      const qrString = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return Result.success(qrString);
    } catch (error) {
      return Result.failure(`Error generando QR DataURL: ${error.message}`);
    }
  }

  async generarQRComoBuffer(payload): Promise<Result<Buffer>> {
    try {
      const qrData = payload;

      const buffer = await QRCode.toBuffer(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
      });

      return Result.success(buffer);
    } catch (error) {
      return Result.failure(`Error generando QR Buffer: ${error.message}`);
    }
  }

  async generarQRComoSVG(payload): Promise<Result<string>> {
    try {
      const qrData = payload;

      const svg = await QRCode.toString(JSON.stringify(qrData), {
        type: 'svg',
        width: 200,
        margin: 2,
      });

      return Result.success(svg);
    } catch (error) {
      return Result.failure(`Error generando QR SVG: ${error.message}`);
    }
  }

  async generarQRComoTextoEnConsola(payload): Promise<Result<string>> {
    try {
      const qrData = payload;

      const terminal = await QRCode.toString(JSON.stringify(qrData), {
        type: 'terminal',
        width: 80,
        errorCorrectionLevel: 'M',
      });

      return Result.success(terminal);
    } catch (error) {
      return Result.failure(`Error generando QR Terminal: ${error.message}`);
    }
  }
}
