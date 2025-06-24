import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CrearGuiaDto } from "src/guias_trazabilidad/application/use-cases/crear-guia/dtos/crear-guia.dto";
import { CrearGuiaCommand } from "src/guias_trazabilidad/application/use-cases/crear-guia/crear-guia.command";
import { RegistrarMovimientoCommand } from "src/guias_trazabilidad/application/use-cases/registrar-movimiento/registrar-movimiento.command";
import { RegistrarMovimientoDto } from "src/guias_trazabilidad/application/use-cases/registrar-movimiento/dtos/registrar-movimiento.dto";

@Controller('guias')
export class GuiaController {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    @Post('crear')
    async crearGuia(@Body() crearGuiaDto: CrearGuiaDto) {
        const command = new CrearGuiaCommand(
            crearGuiaDto.remitente,
            crearGuiaDto.destinatario,
            crearGuiaDto.dimensiones,
            crearGuiaDto.peso,
            crearGuiaDto.valorDeclarado
        )
        return this.commandBus.execute(command), { message: 'sanity check recurso creado', status: 'ok' }
    }

    @Get()
    async sanytiCheck() {
        return {
            message: 'sanity check',
            status: 'ok'
        }
    }

    @Post('movimientos')
    async registrarMovimiento(@Body() registrarMovimientoDto: RegistrarMovimientoDto) {
        const command = new RegistrarMovimientoCommand(
            registrarMovimientoDto.numeroGuia,
            registrarMovimientoDto.idSucursal,
            registrarMovimientoDto.idRuta,
            registrarMovimientoDto.estado,
            registrarMovimientoDto.localizacion
        )
        return this.commandBus.execute(command), { message: 'movimiento registrado', status: 'ok' }
    }

}