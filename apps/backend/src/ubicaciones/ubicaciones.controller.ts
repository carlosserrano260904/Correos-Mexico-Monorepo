import { Controller, Get, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OficinasService } from './ubicaciones.service';
import { Oficina } from '../oficinas/entities/oficina.entity';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) { }

  // Ruta para buscar por código postal
  @Get('buscar/cp/:codigo_postal')
  async findByCodigoPostal(@Param('codigo_postal') codigo_postal: string) {
    const codigoPostalStr = String(codigo_postal).trim();

    const oficinas = await this.oficinasService.findByCodigoPostal(codigoPostalStr);

    if (oficinas.length === 0) {
      // Enviar una respuesta 404 con mensaje amigable
      throw new HttpException('No se encontraron oficinas para ese código postal', HttpStatus.NOT_FOUND);
    }

    return oficinas;
  }


  @Get('buscar/nombre/:nombre_entidad')
  async findByNombreEntidad(@Param('nombre_entidad') nombre_entidad: string) {
    const nombreEntidadStr = String(nombre_entidad).trim();

    const oficinas = await this.oficinasService.findByNombreEntidad(nombreEntidadStr);

    if (oficinas.length === 0) {
      // Enviar una respuesta 404 con mensaje amigable
      throw new HttpException('No se encontraron oficinas para esa entidad', HttpStatus.NOT_FOUND);
    }

    return oficinas;
  }

  @Get('buscar/nombre_municipio/:nombre_municipio')
  async findByNombreMunicipio(@Param('nombre_municipio') nombre_municipio: string) {
    const nombreMunicipioStr = String(nombre_municipio).trim();

    const oficinas = await this.oficinasService.findByNombreMunicipio(nombreMunicipioStr);

    if (oficinas.length === 0) {
      throw new HttpException('No se encontraron oficinas para ese Municipio', HttpStatus.NOT_FOUND);
    }

    return oficinas;
  }

  // @Get('buscar/nombre/:nombre')
  // buscarPorNombre(@Param('nombre') nombre: string) {
  //   return this.oficinasService.buscarPorNombre(nombre);
  // }

}

