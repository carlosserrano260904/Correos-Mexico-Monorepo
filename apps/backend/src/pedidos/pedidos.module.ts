import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Product } from 'src/products/entities/product.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoProducto, Product])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

