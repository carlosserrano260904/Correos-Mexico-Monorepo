import { RegistrarMovimientoCommand } from "./registrar-movimiento.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GuiaRepositoryInterface, GUIAREPOSITORYINTERFACE } from "../../ports/outbound/guia.repository.interface";
import { Inject, NotFoundException } from "@nestjs/common";
import { NumeroSeguimientoVO } from "src/guias_trazabilidad/business-logic/value-objects/numeroSeguimiento.vo";

@CommandHandler(RegistrarMovimientoCommand)
export class RegistrarMovimientoHandler implements ICommandHandler<RegistrarMovimientoCommand> {

    constructor(
        @Inject(GUIAREPOSITORYINTERFACE)
        private readonly guiaRepository: GuiaRepositoryInterface
    ) { }

    async execute(command: RegistrarMovimientoCommand): Promise<any> {

        const numeroSegumiento = NumeroSeguimientoVO.fromString(command.numeroGuia)
        // 1. hidratar la guia
        const guiaEncontrada = await this.guiaRepository.findByNumeroSeguimiento(numeroSegumiento)

        if (!guiaEncontrada) {
            throw new NotFoundException('Guía no encontrada');
        }

        // 2. usar metodo nuevoMovimiento()
        const guiaActualizada = guiaEncontrada.nuevoMovimiento({
            idSucursal: command.idSucursal,
            idRuta: command.idRuta,
            estado: command.estado,
            localizacion: command.localizacion
        })

        // 3. persistir la guia
        await this.guiaRepository.save(guiaActualizada)
    }

}