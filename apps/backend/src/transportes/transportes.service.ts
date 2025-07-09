import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporte } from './entities/transporte.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TransportesService {
  constructor(
    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
  ) { }

  findAll() {
    return this.transporteRepo.find();
  }

  async findOne(id: string): Promise<Transporte | null> {
    return this.transporteRepo.findOne({ where: { id } });
  }

  create(data: Partial<Transporte>) {
    const nuevo = this.transporteRepo.create(data);
    return this.transporteRepo.save(nuevo);
  }

  async update(id: string, data: Partial<Transporte>): Promise<Transporte | null> {
    await this.transporteRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.transporteRepo.delete(id);
  }

  async generarQRsDeTransportes(): Promise<{ id: string; qr: string; filePath: string }[]> {
    const transportes = await this.transporteRepo.find();

    // Ruta absoluta a la carpeta "qrs" dentro del módulo "transportes"
    const outputDir = path.join(__dirname, 'qrs');

    // Crear la carpeta si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const resultados = await Promise.all(
      transportes.map(async (transporte) => {
        const nombreSanitizado = transporte.nombre.replace(/[^a-zA-Z0-9_-]/g, '_'); // evita caracteres inválidos
        const filePath = path.join(outputDir, `${nombreSanitizado}.png`);

        // Guardar QR en archivo PNG
        await QRCode.toFile(filePath, transporte.id);

        // También generar el QR como base64 para devolverlo en la respuesta
        const qr = await QRCode.toDataURL(transporte.id);

        return {
          id: transporte.id,
          qr,
          filePath,
        };
      }),
    );

    return resultados;
  }
}
