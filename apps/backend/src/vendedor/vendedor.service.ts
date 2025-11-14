import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Repository } from 'typeorm';
import { SolicitudDto } from './dto/solicitud.dto';
import { Pedido, PedidoProducto } from '../pedidos/entities/pedido.entity';
import { GuiaTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { ContactosTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/contactos.typeorm-entity';
import { PedidoAsignadoDto, ClienteInfoDto, ProductoPedidoDto } from './dto/pedidos-asignados.dto';

@Injectable()
export class VendedorService {
    constructor(
        @InjectRepository(Solicitud)
        private vendedorRepository: Repository<Solicitud>,
        @InjectRepository(Pedido)
        private pedidoRepository: Repository<Pedido>,
        @InjectRepository(GuiaTypeormEntity)
        private guiaRepository: Repository<GuiaTypeormEntity>,
        @InjectRepository(ContactosTypeormEntity)
        private contactosRepository: Repository<ContactosTypeormEntity>,
    ) {}

    async crearSolicitud(solicitud: SolicitudDto): Promise<Solicitud> {
        console.log('📝 Creando solicitud:', solicitud);
        
        const solicitudEntity = this.vendedorRepository.create({
            ...solicitud,
            userId: Number(solicitud.userId),
        });
        
        const resultado = await this.vendedorRepository.save(solicitudEntity);
        console.log('✅ Solicitud creada:', resultado);
        
        return resultado;
    }

    async encontrarPorUserId(userId: string): Promise<Solicitud | null> {
        return this.vendedorRepository.findOne({ where: { userId: Number(userId) } });
    }

    async obtenerPedidosAsignados(profileId: number): Promise<PedidoAsignadoDto[]> {
        console.log('🔍 Obteniendo pedidos para sellerId:', profileId);

        const sellerIdString = String(profileId);

        // Obtener pedidos que contengan productos del vendedor y que no estén pendientes
        const pedidos = await this.pedidoRepository
            .createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.productos', 'pedidoProducto')
            .leftJoinAndSelect('pedidoProducto.producto', 'producto')
            .leftJoinAndSelect('producto.variants', 'variant')
            .where('producto.sellerId = :profileId', { profileId: sellerIdString })
            .andWhere('pedido.status != :status', { status: 'pendiente' })
            .orderBy('pedido.fecha', 'DESC')
            .getMany();

        console.log('📦 Pedidos encontrados:', pedidos.length);

        const pedidosAsignados: PedidoAsignadoDto[] = [];

        for (const pedido of pedidos) {
            // Filtrar solo los productos que pertenecen al vendedor
            const productosVendedor = pedido.productos.filter(
                pp => pp.producto && pp.producto.sellerId === sellerIdString
            );

            if (productosVendedor.length === 0) continue;

            // Obtener información del cliente desde la primera guía disponible
            const primeraGuia = await this.guiaRepository
                .createQueryBuilder('guia')
                .leftJoinAndSelect('guia.destinatario', 'contacto')
                .orderBy('guia.fecha_creacion', 'ASC')
                .getOne();

            let clienteInfo: ClienteInfoDto = {
                nombre: 'Cliente no identificado',
                direccion: 'Dirección no disponible'
            };

            if (primeraGuia && primeraGuia.destinatario) {
                const contacto = primeraGuia.destinatario;
                clienteInfo = {
                    nombre: `${contacto.nombres} ${contacto.apellidos}`,
                    direccion: this.formatearDireccion(contacto)
                };
            }

            // Mapear productos del vendedor
            const productos: ProductoPedidoDto[] = productosVendedor.map(pp => {
                const variant = pp.producto.variants?.[0];

                return{
                sku: variant?.sku,
                nombre: pp.producto.title,
                cantidad: pp.cantidad,
                estado: primeraGuia?.situacion_actual || 'Sin información'
                };
            });

            pedidosAsignados.push({
                id: pedido.id,
                fecha: pedido.fecha.toISOString().split('T')[0],
                cliente: clienteInfo,
                productos
            });
        }

        console.log('✅ Pedidos asignados procesados:', pedidosAsignados.length);
        return pedidosAsignados;
    }

    private formatearDireccion(contacto: ContactosTypeormEntity): string {
        const partes = [
            contacto.calle,
            contacto.numero,
            contacto.numero_interior,
            contacto.asentamiento,
            contacto.codigo_postal,
            contacto.localidad,
            contacto.estado,
            contacto.pais
        ].filter(parte => parte && parte.trim() !== '');

        return partes.join(', ');
    }
}
