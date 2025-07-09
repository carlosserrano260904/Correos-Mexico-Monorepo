import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoProducto])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

