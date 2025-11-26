import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CrearGuiaDto } from '../../application/use-cases/crear-guia/dtos/crear-guia.dto';
import { CrearGuiaCommand } from '../../application/use-cases/crear-guia/crear-guia.command';
import { RegistrarMovimientoCommand } from '../../application/use-cases/registrar-movimiento/registrar-movimiento.command';
import { RegistrarMovimientoDto } from '../../application/use-cases/registrar-movimiento/dtos/registrar-movimiento.dto';
import { CrearIncidenciaDto } from '../../application/use-cases/crear-incidencia/dtos/crear-incidencia.dto';
import { CrearIncidenciaCommand } from '../../application/use-cases/crear-incidencia/crear-incidencia.command';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ObtenerGuiaPorNumeroQuery } from '../../application/use-cases/obtener-guia-por-numero/obtener-guia-por-numero.query';
import { ListarGuiasQuery } from '../../application/use-cases/listar-guias/listar-guias.query';
import { ListarIncidenciasQuery } from '../../application/use-cases/listar-incidencias/listar-incidencias.query';
import { ListarContactosQuery } from '../../application/use-cases/listar-contactos/listar-contactos.query';
import { CrearQRDto } from '../../../guias_trazabilidad/application/use-cases/crear-QR-guia-terminal/dtos/crear-qr.dto';
import { CrearQRCommand } from '../../../guias_trazabilidad/application/use-cases/crear-QR-guia-terminal/crear-qr.command';

@ApiTags('Guías')
@Controller('guias')
export class GuiaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // !============= COMMANDS =============

  @Post()
  @ApiOperation({ summary: 'Crea una nueva guia y genera el PDF' })
  @ApiBody({ type: CrearGuiaDto })
  @ApiResponse({
    status: 201,
    description: 'Guía creada correctamente y PDF generado',
  })
  @ApiResponse({ status: 400, description: 'Error al crear la guía' })
  async crearGuia(@Body() crearGuiaDto: CrearGuiaDto, @Res() res: Response) {
    const command = new CrearGuiaCommand(
      crearGuiaDto.remitente,
      crearGuiaDto.destinatario,
      crearGuiaDto.dimensiones,
      crearGuiaDto.peso,
      crearGuiaDto.valorDeclarado,
      crearGuiaDto.tipoServicio,
    );

    const result = await this.commandBus.execute(command);

    // headers
    const fileName = `guia-${result.numeroRastreo}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': result.pdf.length,
    });

    res.send(result.pdf);
  }

  @Post('/movimientos')
  @ApiOperation({ summary: 'Registra un nuevo movimiento' })
  @ApiBody({ type: RegistrarMovimientoDto })
  @ApiResponse({
    status: 201,
    description: 'Movimiento registrado correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al registrar el movimiento' })
  async registrarMovimiento(
    @Body() registrarMovimientoDto: RegistrarMovimientoDto,
  ) {
    const command = new RegistrarMovimientoCommand(
      registrarMovimientoDto.numeroGuia,
      registrarMovimientoDto.idSucursal,
      registrarMovimientoDto.idRuta,
      registrarMovimientoDto.estado,
      registrarMovimientoDto.localizacion,
    );
    await this.commandBus.execute(command);
    return { message: 'movimiento registrado', status: 'ok' };
  }

  @Post('/incidencias')
  @ApiOperation({ summary: 'Registra una nueva incidencia' })
  @ApiBody({ type: CrearIncidenciaDto })
  @ApiResponse({
    status: 201,
    description: 'Incidencia registrada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al registrar la incidencia' })
  async registrarIncidencia(@Body() crearIncidenciaDto: CrearIncidenciaDto) {
    const command = new CrearIncidenciaCommand(
      crearIncidenciaDto.numeroRastreo,
      crearIncidenciaDto.tipoIncidencia,
      crearIncidenciaDto.descripcion,
      crearIncidenciaDto.idResponsable,
    );

    await this.commandBus.execute(command);
    return { message: 'incidencia registrada', status: 'ok' };
  }

  /**
   * Endpoint test, no se usa en la aplicacion
   * @param crearQrDto
   * @returns
   */
  @Post('/qrcode')
  async crearQR(@Body() crearQrDto: CrearQRDto) {
    const command = new CrearQRCommand(
      crearQrDto.numeroDeRastreo,
      crearQrDto.idSucursal,
      crearQrDto.idRuta,
      crearQrDto.estado,
      crearQrDto.localizacion,
    );

    await this.commandBus.execute(command);
    return { message: 'qr crearo', status: 'ok' };
  }

  // !============= QUERIES =============

  @Get('/contactos')
  @ApiOperation({ summary: 'Lista todos los contactos registrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contactos obtenida correctamente',
  })
  async listarTodosLosContactos() {
    const query = new ListarContactosQuery();
    const result = await this.queryBus.execute(query);

    if (result.isFailure()) {
      throw new BadRequestException(result.getError());
    }

    return {
      data: result.getValue(),
      total: result.getValue().length,
      status: 'ok',
    };
  }

  @Get('/incidencias')
  @ApiOperation({ summary: 'Lista todas las incidencias registradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de incidencias obtenida correctamente',
  })
  async listarTodasLasIncidencias() {
    const query = new ListarIncidenciasQuery();
    const result = await this.queryBus.execute(query);

    if (result.isFailure()) {
      throw new BadRequestException(result.getError());
    }

    return {
      data: result.getValue(),
      total: result.getValue().length,
      status: 'ok',
    };
  }

  @Get('')
  @ApiOperation({ summary: 'Lista todas las guías registradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de guías obtenida correctamente',
  })
  async listarTodasLasGuias() {
    const query = new ListarGuiasQuery();
    const result = await this.queryBus.execute(query);

    if (result.isFailure()) {
      throw new BadRequestException(result.getError());
    }

    return {
      data: result.getValue(),
      total: result.getValue().length,
      status: 'ok',
    };
  }

  @Get('/:numeroRastreo')
  @ApiOperation({
    summary:
      'Obtiene una guía completa por numero de rastreo con toda la trazabilidad',
  })
  @ApiParam({
    name: 'numeroRastreo',
    description: 'Numero de rastreo de la guia',
    example: 'GU123456789MX',
  })
  @ApiResponse({
    status: 200,
    description: 'Guia encontrada con historial completo',
  })
  @ApiResponse({ status: 404, description: 'Guia no encontrada' })
  async obtenerGuiaPorNumero(@Param('numeroRastreo') numeroRastreo: string) {
    const query = new ObtenerGuiaPorNumeroQuery(numeroRastreo);
    const result = await this.queryBus.execute(query);

    if (result.isFailure()) {
      throw new NotFoundException(result.getError());
    }

    return {
      data: result.getValue(),
      status: 'ok',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Verifica el estado de la aplicacion' })
  @ApiResponse({ status: 200, description: 'Sanity check exitoso' })
  async sanytiCheck() {
    return {
      message: 'Sanity Check Guias funcionando correctamente',
      endpoints: {
        commands: [
          'POST /guias',
          'POST /guias/movimientos',
          'POST /guias/incidencias',
          'POST /guias/qrcode',
        ],
        queries: [
          'GET /guias/contactos',
          'GET /guias/incidencias',
          'GET /guias',
          'GET /guias/:numeroRastreo',
        ],
      },
      status: 'ok',
    };
  }
}
