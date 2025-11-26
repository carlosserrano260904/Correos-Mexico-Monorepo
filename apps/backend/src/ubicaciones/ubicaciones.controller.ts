import { Controller, Get, Param, Query } from '@nestjs/common';
import { OficinasService } from './ubicaciones.service';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  // Ruta unificada para búsqueda más rápida
  @Get('buscar/:termino')
  async buscarOficinas(@Param('termino') termino: string) {
    const terminoLimpio = String(termino).trim();

    // El servicio manejará la lógica de búsqueda y deduplicación
    const oficinas = await this.oficinasService.buscarOficinas(terminoLimpio);

    return oficinas; // Siempre devuelve array (vacío si no encuentra)
  }

  // Mantener rutas específicas por compatibilidad (opcional)
  @Get('buscar/cp/:codigo_postal')
  async findByCodigoPostal(@Param('codigo_postal') codigo_postal: string) {
    return this.buscarOficinas(codigo_postal);
  }

  @Get('buscar/nombre/:nombre_entidad')
  async findByNombreEntidad(@Param('nombre_entidad') nombre_entidad: string) {
    return this.buscarOficinas(nombre_entidad);
  }
}
