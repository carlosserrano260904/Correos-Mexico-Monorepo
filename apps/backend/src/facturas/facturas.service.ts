import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturasRepository: Repository<Factura>,
  ) {}

  // ✅ Obtener todas las facturas
  findAll(): Promise<Factura[]> {
    return this.facturasRepository.find({
      order: { fecha_creacion: 'DESC' }
    });
  }

  // ✅ Obtener facturas de un perfil específico
  findByProfile(profileId: string): Promise<Factura[]> {
    return this.facturasRepository.find({
      where: { profile: { id: Number(profileId) } },
      order: { fecha_creacion: 'DESC' }
    });
  }

  // ✅ Crear y guardar nueva factura (usado desde pagos.service)
  async crearFacturaConPago(
    profile: Profile,
    amount: number,
    status: string,
    productos: string[] = ['Envío Estándar']
  ): Promise<Factura> {
    const count = await this.facturasRepository
      .createQueryBuilder('factura')
      .getCount();

    const numero_factura = `F-2025-${(count + 1).toString().padStart(3, '0')}`;

    const nuevaFactura = this.facturasRepository.create({
      numero_factura,
      precio: amount / 100, // convertir de centavos a MXN
      sucursal: profile.nombre || 'Sucursal desconocida',
      status,
      productos,
      fecha_creacion: new Date(),
      fecha_vencimiento: new Date(new Date().setDate(new Date().getDate() + 30)),
      profile,
    });

    return this.facturasRepository.save(nuevaFactura);
  }
}
