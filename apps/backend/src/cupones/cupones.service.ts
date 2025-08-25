import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cupon, EstadoCupon, TipoCupon } from './entities/cupon.entity';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { ValidarCuponDto } from './dto/validar-cupon.dto';

@Injectable()
export class CuponesService {
  constructor(
    @InjectRepository(Cupon)
    private cuponesRepository: Repository<Cupon>,
  ) {}

  async create(createCuponDto: CreateCuponDto): Promise<Cupon> {
    // Verificar que el código no exista
    const existeCupon = await this.cuponesRepository.findOne({
      where: { codigo: createCuponDto.codigo }
    });

    if (existeCupon) {
      throw new BadRequestException('Ya existe un cupón con este código');
    }

    // Validaciones específicas
    if (createCuponDto.tipo === TipoCupon.PORCENTAJE && createCuponDto.valor > 100) {
      throw new BadRequestException('El porcentaje de descuento no puede ser mayor a 100%');
    }

    if (createCuponDto.fecha_expiracion) {
      const fechaExpiracion = new Date(createCuponDto.fecha_expiracion);
      if (fechaExpiracion <= new Date()) {
        throw new BadRequestException('La fecha de expiración debe ser futura');
      }
    }

    const cuponData: any = {
      ...createCuponDto,
      usos_actuales: 0,
    };

    if (createCuponDto.fecha_expiracion) {
      cuponData.fecha_expiracion = new Date(createCuponDto.fecha_expiracion);
    }

    const cupon = new Cupon();
    Object.assign(cupon, cuponData);
    
    const savedCupon = await this.cuponesRepository.save(cupon);
    return savedCupon;
  }

  async findAll(): Promise<Cupon[]> {
    return await this.cuponesRepository.find({
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findAllActivos(): Promise<Cupon[]> {
    return await this.cuponesRepository.find({
      where: { estado: EstadoCupon.ACTIVO },
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Cupon> {
    const cupon = await this.cuponesRepository.findOne({ where: { id } });
    if (!cupon) {
      throw new NotFoundException(`Cupón con ID ${id} no encontrado`);
    }
    return cupon;
  }

  async findByCodigo(codigo: string): Promise<Cupon> {
    const cupon = await this.cuponesRepository.findOne({ where: { codigo } });
    if (!cupon) {
      throw new NotFoundException(`Cupón con código ${codigo} no encontrado`);
    }
    return cupon;
  }

  async update(id: number, updateCuponDto: UpdateCuponDto): Promise<Cupon> {
    const cupon = await this.findOne(id);

    // Validar código único si se está actualizando
    if (updateCuponDto.codigo && updateCuponDto.codigo !== cupon.codigo) {
      const existeCupon = await this.cuponesRepository.findOne({
        where: { codigo: updateCuponDto.codigo }
      });
      if (existeCupon) {
        throw new BadRequestException('Ya existe un cupón con este código');
      }
    }

    // Validaciones específicas
    if (updateCuponDto.tipo === TipoCupon.PORCENTAJE && updateCuponDto.valor && updateCuponDto.valor > 100) {
      throw new BadRequestException('El porcentaje de descuento no puede ser mayor a 100%');
    }

    if (updateCuponDto.fecha_expiracion) {
      const fechaExpiracion = new Date(updateCuponDto.fecha_expiracion);
      if (fechaExpiracion <= new Date()) {
        throw new BadRequestException('La fecha de expiración debe ser futura');
      }
    }

    const updateData: any = { ...updateCuponDto };
    
    if (updateCuponDto.fecha_expiracion) {
      updateData.fecha_expiracion = new Date(updateCuponDto.fecha_expiracion);
    }

    await this.cuponesRepository.update(id, updateData);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cupon = await this.findOne(id);
    await this.cuponesRepository.remove(cupon);
  }

  async validarCupon(validarCuponDto: ValidarCuponDto): Promise<{
    valido: boolean;
    mensaje: string;
    descuento?: number;
    cupon?: Cupon;
  }> {
    try {
      const cupon = await this.findByCodigo(validarCuponDto.codigo);

      // Verificar estado del cupón
      if (cupon.estado !== EstadoCupon.ACTIVO) {
        return {
          valido: false,
          mensaje: 'El cupón no está activo'
        };
      }

      // Verificar fecha de expiración
      if (cupon.fecha_expiracion && new Date() > cupon.fecha_expiracion) {
        // Actualizar estado si está expirado
        await this.cuponesRepository.update(cupon.id, { estado: EstadoCupon.EXPIRADO });
        return {
          valido: false,
          mensaje: 'El cupón ha expirado'
        };
      }

      // Verificar usos máximos
      if (cupon.usos_actuales >= cupon.usos_maximos) {
        // Actualizar estado si está agotado
        await this.cuponesRepository.update(cupon.id, { estado: EstadoCupon.AGOTADO });
        return {
          valido: false,
          mensaje: 'El cupón ha alcanzado el límite de usos'
        };
      }

      // Verificar monto mínimo
      if (validarCuponDto.monto_compra < cupon.monto_minimo) {
        return {
          valido: false,
          mensaje: `El monto mínimo para usar este cupón es $${cupon.monto_minimo}`
        };
      }

      // Verificar categorías aplicables
      if (cupon.categorias_aplicables && cupon.categorias_aplicables.length > 0) {
        if (!validarCuponDto.categorias || 
            !validarCuponDto.categorias.some(cat => cupon.categorias_aplicables.includes(cat))) {
          return {
            valido: false,
            mensaje: 'Este cupón no aplica para los productos seleccionados'
          };
        }
      }

      // Verificar productos aplicables
      if (cupon.productos_aplicables && cupon.productos_aplicables.length > 0) {
        if (!validarCuponDto.productos_ids || 
            !validarCuponDto.productos_ids.some(id => cupon.productos_aplicables.includes(id))) {
          return {
            valido: false,
            mensaje: 'Este cupón no aplica para los productos seleccionados'
          };
        }
      }

      // Calcular descuento
      let descuento: number;
      if (cupon.tipo === TipoCupon.PORCENTAJE) {
        descuento = (validarCuponDto.monto_compra * cupon.valor) / 100;
        // Aplicar descuento máximo si está definido
        if (cupon.descuento_maximo && descuento > cupon.descuento_maximo) {
          descuento = cupon.descuento_maximo;
        }
      } else {
        descuento = cupon.valor;
      }

      // El descuento no puede ser mayor al monto de compra
      if (descuento > validarCuponDto.monto_compra) {
        descuento = validarCuponDto.monto_compra;
      }

      return {
        valido: true,
        mensaje: 'Cupón válido',
        descuento: Math.round(descuento * 100) / 100, // Redondear a 2 decimales
        cupon
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          valido: false,
          mensaje: 'El cupón no existe'
        };
      }
      throw error;
    }
  }

  async aplicarCupon(codigo: string, usuarioId?: number): Promise<Cupon> {
    const cupon = await this.findByCodigo(codigo);
    
    // Incrementar uso
    await this.cuponesRepository.update(cupon.id, {
      usos_actuales: cupon.usos_actuales + 1
    });

    return await this.findOne(cupon.id);
  }

  async desactivarCupon(id: number): Promise<Cupon> {
    await this.cuponesRepository.update(id, { estado: EstadoCupon.INACTIVO });
    return await this.findOne(id);
  }

  async activarCupon(id: number): Promise<Cupon> {
    await this.cuponesRepository.update(id, { estado: EstadoCupon.ACTIVO });
    return await this.findOne(id);
  }

  async getEstadisticasCupon(id: number): Promise<{
    cupon: Cupon;
    porcentaje_uso: number;
    usos_restantes: number;
  }> {
    const cupon = await this.findOne(id);
    const porcentaje_uso = (cupon.usos_actuales / cupon.usos_maximos) * 100;
    const usos_restantes = cupon.usos_maximos - cupon.usos_actuales;

    return {
      cupon,
      porcentaje_uso: Math.round(porcentaje_uso * 100) / 100,
      usos_restantes
    };
  }
}
