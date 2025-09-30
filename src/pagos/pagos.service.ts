import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    private readonly facturasService: FacturasService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Confirma pago (dummy) ➜ vacía carrito ➜ crea factura.
   * Si después integras Stripe, reemplaza la sección de "pago dummy".
   */
  async confirmarPago(
    profileId: string,
    total: number,
    _stripeCardId?: string,
    _modo: 'real' | 'dummy' = 'dummy',
  ) {
    // 1) Validaciones
    const profile = await this.profileRepo.findOne({ where: { id: Number(profileId) } });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const totalMXN = Number(total);
    if (!Number.isFinite(totalMXN) || totalMXN <= 0) {
      throw new BadRequestException('Total inválido');
    }

    // 2) "Cobro" (dummy): marca como pagado
    const paymentIntentId = 'pi_dummy';
    const paymentStatus = 'succeeded';

    // 3) Vaciar carrito del usuario (sin joins)
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('carrito')                  // nombre real de la tabla
      .where('usuarioId = :uid AND activo = true', { uid: Number(profileId) })
      .execute();

    // 4) Crear factura (usa tu método del servicio de facturas "desde cero")
    await this.facturasService.crearDesdePago({
      profileId: profile.id,
      totalMXN,                         // MXN (no centavos)
      status: 'PAGADA',                 // o usa paymentStatus si prefieres
      productos: ['Compra en Correos MX'],
    });

    // 5) Respuesta para el front
    return {
      status: 'success',
      message: 'Pago confirmado, carrito vaciado y factura creada',
      paymentIntentId,
      profile: { id: profile.id },
    };
  }
}
