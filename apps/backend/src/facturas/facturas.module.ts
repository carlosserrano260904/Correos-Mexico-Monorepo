import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './factura.entity';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura])],
  providers: [FacturasService],
  controllers: [FacturasController],
  exports: [FacturasService], // ✅ <--- ¡esto es lo único que te faltaba!
})
export class FacturasModule {}
