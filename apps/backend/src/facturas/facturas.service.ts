import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura) private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
  ) {}

  // Crear factura tras pago
  async crearDesdePago(opts: {
    profileId: number;
    totalMXN: number;           // en MXN
    status: string;             // 'PAGADA' | 'CREADA' | etc.
    productos?: string[];       // ['Producto x2', 'Envío Estándar']
  }): Promise<Factura> {
    const profile = await this.profileRepo.findOne({ where: { id: opts.profileId } });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const consecutivo = await this.facturaRepo.count();
    const numeroFactura = `F-${new Date().getFullYear()}-${String(consecutivo + 1).padStart(6, '0')}`;

    const factura = this.facturaRepo.create({
      numero_factura: numeroFactura,
      precio: opts.totalMXN,                            // ajusta al nombre de tu columna
      status: opts.status,
      productos: opts.productos ?? ['Compra en Correos MX'],
      fecha_creacion: new Date(),
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sucursal: 'Correos Clic',
      profile,
    });

    return this.facturaRepo.save(factura);
  }

  // Listados (útiles para probar)
  findAll() {
    return this.facturaRepo.find({ order: { fecha_creacion: 'DESC' } });
  }

  findByProfile(profileId: number) {
    return this.facturaRepo.find({
      where: { profile: { id: profileId } },
      order: { fecha_creacion: 'DESC' },
    });
  }
}
