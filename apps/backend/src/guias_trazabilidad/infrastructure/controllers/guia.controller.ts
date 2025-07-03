import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CrearGuiaDto } from "src/guias_trazabilidad/application/use-cases/crear-guia/dtos/crear-guia.dto";
import { CrearGuiaCommand } from "src/guias_trazabilidad/application/use-cases/crear-guia/crear-guia.command";
import { RegistrarMovimientoCommand } from "src/guias_trazabilidad/application/use-cases/registrar-movimiento/registrar-movimiento.command";
import { RegistrarMovimientoDto } from "src/guias_trazabilidad/application/use-cases/registrar-movimiento/dtos/registrar-movimiento.dto";
import { CrearIncidenciaDto } from "src/guias_trazabilidad/application/use-cases/crear-incidencia/dtos/crear-incidencia.dto";
import { CrearIncidenciaCommand } from "src/guias_trazabilidad/application/use-cases/crear-incidencia/crear-incidencia.command";
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('Guías')
@Controller('guias')
export class GuiaController {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    @Post('nuevaGuia')
    @ApiOperation({ summary: 'Crea una nueva guia' })
    @ApiBody({ type: CrearGuiaDto })
    @ApiResponse({ status: 201, description: 'Guía creada correctamente' })
    @ApiResponse({ status: 400, description: 'Error al crear la guía' })
    async crearGuia(@Body() crearGuiaDto: CrearGuiaDto) {
        const command = new CrearGuiaCommand(
            crearGuiaDto.remitente,
            crearGuiaDto.destinatario,
            crearGuiaDto.dimensiones,
            crearGuiaDto.peso,
            crearGuiaDto.valorDeclarado
        );
        await this.commandBus.execute(command);
        return { message: 'guía creada', status: 'ok' };
    }

    @Get()
    @ApiOperation({ summary: 'Verifica el estado de la aplicación' })
    @ApiResponse({ status: 200, description: 'Sanity check exitoso' })
    async sanytiCheck() {
        return {
            message: 'sanity check',
            status: 'ok'
        }
    }

    @Post('nuevoMovimiento')
    @ApiOperation({ summary: 'Registra un nuevo movimiento' })
    @ApiBody({ type: RegistrarMovimientoDto })
    @ApiResponse({ status: 201, description: 'Movimiento registrado correctamente' })
    @ApiResponse({ status: 400, description: 'Error al registrar el movimiento' })
    async registrarMovimiento(@Body() registrarMovimientoDto: RegistrarMovimientoDto) {
        const command = new RegistrarMovimientoCommand(
            registrarMovimientoDto.numeroGuia,
            registrarMovimientoDto.idSucursal,
            registrarMovimientoDto.idRuta,
            registrarMovimientoDto.estado,
            registrarMovimientoDto.localizacion
        );
        await this.commandBus.execute(command);
        return { message: 'movimiento registrado', status: 'ok' };
    }

    @Post('nuevaIncidencia')
    @ApiOperation({ summary: 'Registra una nueva incidencia' })
    @ApiBody({ type: CrearIncidenciaDto })
    @ApiResponse({ status: 201, description: 'Incidencia registrada correctamente' })
    @ApiResponse({ status: 400, description: 'Error al registrar la incidencia' })
    async registrarIncidencia(@Body() crearIncidenciaDto: CrearIncidenciaDto) {
        const command = new CrearIncidenciaCommand(
            crearIncidenciaDto.numeroRastreo,
            crearIncidenciaDto.tipoIncidencia,
            crearIncidenciaDto.descripcion,
            crearIncidenciaDto.idResponsable
        );

        await this.commandBus.execute(command);
        return { message: 'incidencia registrada', status: 'ok' };
    }
}