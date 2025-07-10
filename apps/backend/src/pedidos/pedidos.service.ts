//pedidos.service.ts
// Este archivo define el servicio para manejar la lógica de negocio relacionada con los pedidos.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get('DATABASE_HOST'),
      port: parseInt(this.configService.get<string>('DATABASE_PORT') ?? '5432', 10),
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASS'),
      database: this.configService.get('DATABASE_NAME'),
      ssl: { rejectUnauthorized: false },
    });

  }

  async create(createPedidoDto: CreatePedidoDto) {
    console.log('DTO recibido:', createPedidoDto);


    const { profileid, status, productos } = createPedidoDto;

    let total = 0;
    const detalles: { producto_id: any; cantidad: any; precio: any }[] = [];

    // 1. Buscar el precio de cada producto
    for (const prod of productos) {
      const result = await this.pool.query(
        `SELECT precio FROM product WHERE id = $1`,
        [prod.producto_id]
      );

      if (result.rows.length === 0) {
        throw new Error(`Producto con id ${prod.producto_id} no encontrado`);
      }

      const precio = result.rows[0].precio;
      const subtotal = precio * prod.cantidad;
      total += subtotal;

      detalles.push({
        producto_id: prod.producto_id,
        cantidad: prod.cantidad,
        precio, // 💰 precio congelado
      });
    }

    // 2. Insertar el pedido con el total calculado
    const pedidoRes = await this.pool.query(
      `INSERT INTO pedidos (profileid, total, status, fecha)
     VALUES ($1, $2, $3, NOW()) RETURNING id`,
      [profileid, total, status]
    );

    const pedidoId = pedidoRes.rows[0].id;

    // 3. Insertar productos asociados con precio congelado
    for (const item of detalles) {
      await this.pool.query(
        `INSERT INTO pedido_productos (pedido_id, producto_id, cantidad, precio)
       VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.producto_id, item.cantidad, item.precio]
      );
    }

    return {
      id: pedidoId,
      profileid,
      status,
      total,
      productos: detalles
    };
  }


  async findAll() {
    const result = await this.pool.query(`
      SELECT 
        p.id, p.fecha, p.status, p.total, p.profileid,
        json_agg(json_build_object(
          'producto_id', pp.producto_id,
          'cantidad', pp.cantidad
        )) AS productos
      FROM pedidos p
      LEFT JOIN pedido_productos pp ON pp.pedido_id = p.id
      GROUP BY p.id
      ORDER BY p.fecha DESC
    `);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(`
      SELECT 
        p.id, p.fecha, p.status, p.total, p.profileid,
        json_agg(json_build_object(
          'producto_id', pp.producto_id,
          'cantidad', pp.cantidad
        )) AS productos
      FROM pedidos p
      LEFT JOIN pedido_productos pp ON pp.pedido_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    return result.rows[0] ?? { message: 'Pedido no encontrado' };
  }

  //async update(id: number, updatePedidoDto: UpdatePedidoDto) {
  //  const { status, total } = updatePedidoDto;
  //  const result = await this.pool.query(
  //    `UPDATE pedidos SET status = $1, total = $2 WHERE id = $3 RETURNING *`,
  //    [status, total, id]
  //  );
  //  return result.rows[0] ?? { message: 'No se pudo actualizar el pedido' };
  //}

  async remove(id: number) {
    await this.pool.query(`DELETE FROM pedido_productos WHERE pedido_id = $1`, [id]);
    const result = await this.pool.query(`DELETE FROM pedidos WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0] ?? { message: 'No se pudo eliminar el pedido' };
  }

  // 👇 Método específico para pedidos de un usuario
  async findByUser(profileid: number) {
    const result = await this.pool.query(`
      SELECT 
        p.id, p.fecha, p.status, p.total,
        json_agg(json_build_object(
          'producto_id', pp.producto_id,
          'cantidad', pp.cantidad
        )) AS productos
      FROM pedidos p
      JOIN pedido_productos pp ON pp.pedido_id = p.id
      WHERE p.profileid = $1
      GROUP BY p.id
      ORDER BY p.fecha DESC
    `, [profileid]);

    return result.rows;
  }
}
