import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Not } from 'typeorm';
import { Descuento, EstadoDescuento, TipoDescuento, TipoAplicacion } from './entities/descuento.entity';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { CalcularDescuentosDto } from './dto/calcular-descuentos.dto';

@Injectable()
export class DescuentosService {
  constructor(
    @InjectRepository(Descuento)
    private descuentosRepository: Repository<Descuento>,
  ) {}

  async create(createDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    // Validaciones específicas
    if (createDescuentoDto.tipo === TipoDescuento.PORCENTAJE && createDescuentoDto.valor > 100) {
      throw new BadRequestException('El porcentaje de descuento no puede ser mayor a 100%');
    }

    if (createDescuentoDto.fecha_inicio && createDescuentoDto.fecha_fin) {
      const fechaInicio = new Date(createDescuentoDto.fecha_inicio);
      const fechaFin = new Date(createDescuentoDto.fecha_fin);
      
      if (fechaInicio >= fechaFin) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    const descuentoData: any = {
      ...createDescuentoDto,
      usos_actuales: 0,
    };

    if (createDescuentoDto.fecha_inicio) {
      descuentoData.fecha_inicio = new Date(createDescuentoDto.fecha_inicio);
    }

    if (createDescuentoDto.fecha_fin) {
      descuentoData.fecha_fin = new Date(createDescuentoDto.fecha_fin);
    }

    const descuento = new Descuento();
    Object.assign(descuento, descuentoData);
    
    const savedDescuento = await this.descuentosRepository.save(descuento);
    return savedDescuento;
  }

  async findAll(): Promise<Descuento[]> {
    return await this.descuentosRepository.find({
      order: { prioridad: 'ASC', fecha_creacion: 'DESC' }
    });
  }

  async findAllActivos(): Promise<Descuento[]> {
    const now = new Date();
    
    return await this.descuentosRepository.find({
      where: [
        {
          estado: EstadoDescuento.ACTIVO,
          fecha_inicio: LessThanOrEqual(now),
          fecha_fin: MoreThanOrEqual(now)
        },
        {
          estado: EstadoDescuento.ACTIVO,
          fecha_inicio: IsNull(),
          fecha_fin: IsNull()
        },
        {
          estado: EstadoDescuento.ACTIVO,
          fecha_inicio: LessThanOrEqual(now),
          fecha_fin: IsNull()
        },
        {
          estado: EstadoDescuento.ACTIVO,
          fecha_inicio: IsNull(),
          fecha_fin: MoreThanOrEqual(now)
        }
      ],
      order: { prioridad: 'ASC', fecha_creacion: 'DESC' }
    });
  }

  async findAllAutomaticos(): Promise<Descuento[]> {
    const descuentosActivos = await this.findAllActivos();
    return descuentosActivos.filter(descuento => descuento.automatico);
  }

  async findOne(id: number): Promise<Descuento> {
    const descuento = await this.descuentosRepository.findOne({ where: { id } });
    if (!descuento) {
      throw new NotFoundException(`Descuento con ID ${id} no encontrado`);
    }
    return descuento;
  }

  async update(id: number, updateDescuentoDto: UpdateDescuentoDto): Promise<Descuento> {
    const descuento = await this.findOne(id);

    // Validaciones específicas
    if (updateDescuentoDto.tipo === TipoDescuento.PORCENTAJE && 
        updateDescuentoDto.valor && updateDescuentoDto.valor > 100) {
      throw new BadRequestException('El porcentaje de descuento no puede ser mayor a 100%');
    }

    if (updateDescuentoDto.fecha_inicio && updateDescuentoDto.fecha_fin) {
      const fechaInicio = new Date(updateDescuentoDto.fecha_inicio);
      const fechaFin = new Date(updateDescuentoDto.fecha_fin);
      
      if (fechaInicio >= fechaFin) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    const updateData: any = { ...updateDescuentoDto };
    
    if (updateDescuentoDto.fecha_inicio) {
      updateData.fecha_inicio = new Date(updateDescuentoDto.fecha_inicio);
    }

    if (updateDescuentoDto.fecha_fin) {
      updateData.fecha_fin = new Date(updateDescuentoDto.fecha_fin);
    }

    await this.descuentosRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const descuento = await this.findOne(id);
    await this.descuentosRepository.remove(descuento);
  }

  async calcularDescuentosAplicables(calcularDto: CalcularDescuentosDto): Promise<{
    descuentos_aplicables: Descuento[];
    mejor_descuento: Descuento | null;
    descuento_total: number;
    ahorro_maximo: number;
  }> {
    const descuentosActivos = await this.findAllActivos();
    const descuentosAplicables: Descuento[] = [];

    for (const descuento of descuentosActivos) {
      const esAplicable = await this.evaluarDescuento(descuento, calcularDto);
      if (esAplicable) {
        descuentosAplicables.push(descuento);
      }
    }

    // Ordenar por prioridad (menor número = mayor prioridad)
    descuentosAplicables.sort((a, b) => a.prioridad - b.prioridad);

    // Calcular el mejor descuento
    let mejorDescuento: Descuento | null = null;
    let mayorAhorro = 0;

    for (const descuento of descuentosAplicables) {
      const ahorro = this.calcularAhorro(descuento, calcularDto.monto_compra);
      if (ahorro > mayorAhorro) {
        mayorAhorro = ahorro;
        mejorDescuento = descuento;
      }
    }

    return {
      descuentos_aplicables: descuentosAplicables,
      mejor_descuento: mejorDescuento,
      descuento_total: mayorAhorro,
      ahorro_maximo: mayorAhorro
    };
  }

  private async evaluarDescuento(descuento: Descuento, calcularDto: CalcularDescuentosDto): Promise<boolean> {
    // Verificar monto mínimo
    if (calcularDto.monto_compra < descuento.monto_minimo) {
      return false;
    }

    // Verificar usos máximos
    if (descuento.usos_maximos && descuento.usos_actuales >= descuento.usos_maximos) {
      return false;
    }

    // Verificar tipo de aplicación
    switch (descuento.tipo_aplicacion) {
      case TipoAplicacion.PRODUCTO:
        if (!calcularDto.productos_ids || !descuento.valores_aplicacion) {
          return false;
        }
        const productosAplicables = descuento.valores_aplicacion as number[];
        return calcularDto.productos_ids.some(id => productosAplicables.includes(id));

      case TipoAplicacion.CATEGORIA:
        if (!calcularDto.categorias || !descuento.valores_aplicacion) {
          return false;
        }
        const categoriasAplicables = descuento.valores_aplicacion as string[];
        return calcularDto.categorias.some(cat => categoriasAplicables.includes(cat));

      case TipoAplicacion.MARCA:
        if (!calcularDto.marcas || !descuento.valores_aplicacion) {
          return false;
        }
        const marcasAplicables = descuento.valores_aplicacion as string[];
        return calcularDto.marcas.some(marca => marcasAplicables.includes(marca));

      case TipoAplicacion.PRIMERA_COMPRA:
        return calcularDto.es_primera_compra === true;

      case TipoAplicacion.USUARIO_ESPECIFICO:
        if (!calcularDto.usuario_id || !descuento.valores_aplicacion) {
          return false;
        }
        const usuariosAplicables = descuento.valores_aplicacion as number[];
        return usuariosAplicables.includes(calcularDto.usuario_id);

      case TipoAplicacion.COMPRA_MINIMA:
        return true; // Ya se verificó el monto mínimo arriba

      default:
        return true;
    }
  }

  private calcularAhorro(descuento: Descuento, montoCompra: number): number {
    let ahorro: number;

    if (descuento.tipo === TipoDescuento.PORCENTAJE) {
      ahorro = (montoCompra * descuento.valor) / 100;
      // Aplicar descuento máximo si está definido
      if (descuento.descuento_maximo && ahorro > descuento.descuento_maximo) {
        ahorro = descuento.descuento_maximo;
      }
    } else {
      ahorro = descuento.valor;
    }

    // El ahorro no puede ser mayor al monto de compra
    if (ahorro > montoCompra) {
      ahorro = montoCompra;
    }

    return Math.round(ahorro * 100) / 100; // Redondear a 2 decimales
  }

  async aplicarDescuento(id: number): Promise<Descuento> {
    const descuento = await this.findOne(id);
    
    // Incrementar uso
    await this.descuentosRepository.update(id, {
      usos_actuales: descuento.usos_actuales + 1
    });

    return await this.findOne(id);
  }

  async desactivarDescuento(id: number): Promise<Descuento> {
    await this.descuentosRepository.update(id, { estado: EstadoDescuento.INACTIVO });
    return await this.findOne(id);
  }

  async activarDescuento(id: number): Promise<Descuento> {
    await this.descuentosRepository.update(id, { estado: EstadoDescuento.ACTIVO });
    return await this.findOne(id);
  }

  async getEstadisticasDescuento(id: number): Promise<{
    descuento: Descuento;
    porcentaje_uso: number;
    usos_restantes: number;
    dias_restantes: number | null;
  }> {
    const descuento = await this.findOne(id);
    
    let porcentaje_uso = 0;
    let usos_restantes = 0;
    
    if (descuento.usos_maximos) {
      porcentaje_uso = (descuento.usos_actuales / descuento.usos_maximos) * 100;
      usos_restantes = descuento.usos_maximos - descuento.usos_actuales;
    }

    let dias_restantes: number | null = null;
    if (descuento.fecha_fin) {
      const ahora = new Date();
      const fechaFin = new Date(descuento.fecha_fin);
      const diferencia = fechaFin.getTime() - ahora.getTime();
      dias_restantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    return {
      descuento,
      porcentaje_uso: Math.round(porcentaje_uso * 100) / 100,
      usos_restantes,
      dias_restantes
    };
  }

  async actualizarEstadosExpirados(): Promise<void> {
    const now = new Date();
    
    await this.descuentosRepository.update(
      { 
        fecha_fin: LessThanOrEqual(now),
        estado: Not(EstadoDescuento.EXPIRADO)
      },
      { estado: EstadoDescuento.EXPIRADO }
    );
  }
}
