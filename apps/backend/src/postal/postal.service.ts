import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostalService {
  private data: string[][] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const filePath = path.resolve(__dirname, '../../codigos_postales.txt');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    // La primera línea es el header, la saltamos
    lines.shift();
    // Separar cada línea por pipe
    this.data = lines.map((line) => line.split('|'));
  }

  findByCodigo(codigoPostal: string) {
    // El campo d_codigo es el índice 0
    const found = this.data.filter((row) => row[0] === codigoPostal);
    if (found.length === 0) {
      throw new NotFoundException('Código postal no encontrado');
    }
    // Mapear a objeto legible los campos
    return found.map((row) => ({
      d_codigo: row[0],
      d_asenta: row[1],
      d_tipo_asenta: row[2],
      d_mnpio: row[3],
      d_estado: row[4],
      d_ciudad: row[5],
      d_CP: row[6],
    }));
  }
}
