import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Product } from '../products/entities/product.entity';
import { Misdireccione } from '../misdirecciones/entities/misdireccione.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoProducto, Product, Misdireccione])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
