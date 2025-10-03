import { Module } from '@nestjs/common';
import { VendedorController } from './vendedor.controller';
import { VendedorService } from './vendedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Pedido, PedidoProducto } from '../pedidos/entities/pedido.entity';
import { GuiaTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { ContactosTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/contactos.typeorm-entity';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService],
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      Pedido,
      PedidoProducto,
      GuiaTypeormEntity,
      ContactosTypeormEntity
    ])
  ],
})
export class VendedorModule {}
