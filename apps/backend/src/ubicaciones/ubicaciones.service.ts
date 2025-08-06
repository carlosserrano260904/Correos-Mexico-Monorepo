import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Oficina } from '../oficinas/entities/oficina.entity';
import { Repository, Like, ILike } from 'typeorm';
@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private readonly oficinaRepository: Repository<Oficina>,
  ) { }


  // Método que busca oficinas por código postal
  async findByCodigoPostal(codigo_postal: string) {
    try {
      const codigoPostalStr = codigo_postal.trim(); // Limpia el código postal

      console.log('Buscando código postal:', codigoPostalStr);  // Verifica que el código postal sea correcto

      // Realiza la consulta utilizando createQueryBuilder para buscar por código postal
      const oficinas = await this.oficinaRepository
        .createQueryBuilder('oficina')
        .where('oficina.codigo_postal = :codigo_postal', { codigo_postal: codigoPostalStr })
        .andWhere('oficina.activo = true')  // Asegúrate de que la oficina esté activa
        .getMany();

      if (oficinas.length === 0) {
        throw new HttpException('Oficina no encontrada', HttpStatus.NOT_FOUND);
      }

      return oficinas; // Devuelve las oficinas encontradas
    } catch (error) {
      console.error('Error en findByCodigoPostal:', error);
      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findByNombreEntidad(nombre_entidad: string) {
    try {
      const oficinas = await this.oficinaRepository
        .createQueryBuilder('oficina')
        .where('oficina.nombre_entidad ILIKE :nombre', { nombre: `%${nombre_entidad}%` })
        .andWhere('oficina.activo = true')
        .getMany();

      if (oficinas.length === 0) {
        // Devolvemos 404 directamente
        throw new HttpException('No se encontraron oficinas con ese nombre de entidad', HttpStatus.NOT_FOUND);
      }

      return oficinas;
    } catch (error) {
      console.error('Error en findByNombreEntidad:', error);

      // Si el error ya es un HttpException, no lo reemplaces
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findByNombreMunicipio(nombre_municipio: string) {
    try {
      const oficinas = await this.oficinaRepository
        .createQueryBuilder('oficina')
        .where('oficina.nombre_municipio ILIKE :nombre', { nombre: `%${nombre_municipio}%` })
        .andWhere('oficina.activo = true')
        .getMany();

      if (oficinas.length === 0) {
        // Devolvemos 404 directamente
        throw new HttpException('No se encontraron oficinas con ese nombre de municipio', HttpStatus.NOT_FOUND);
      }

      return oficinas;
    } catch (error) {
      console.error('Error en findByNombreEntidad:', error);

      // Si el error ya es un HttpException, no lo reemplaces
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async buscarPorNombre(nombre: string): Promise<Oficina[]> {
  //   return this.oficinaRepository.find({
  //     where: { nombre_entidad: ILike(`%${nombre}%`) }, // ILike para búsqueda insensible a mayúsculas/minúsculas
  //   });
  // }

}
