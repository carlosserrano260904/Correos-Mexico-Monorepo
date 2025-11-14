import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Product } from 'src/products/entities/product.entity';
import { Misdireccione } from 'src/misdirecciones/entities/misdireccione.entity';
import { ProductVariant } from 'src/products/entities/productVariant.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoProducto, Product, Misdireccione, ProductVariant])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
