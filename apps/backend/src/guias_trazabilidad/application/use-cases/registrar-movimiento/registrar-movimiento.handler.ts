import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { Result } from '../../../../utils/result';
import { RegistrarMovimientoCommand } from './registrar-movimiento.command';
import {
  GuiaRepositoryInterface,
  GUIAREPOSITORYINTERFACE,
} from '../../ports/outbound/guia.repository.interface';
import { NumeroDeRastreoVO } from '../../../business-logic/value-objects/numeroRastreo.vo';
import { MovimientoDomainEntity } from '../../../business-logic/movimiento.entity';
import { SituacionVO } from '../../../business-logic/value-objects/situacion.vo';
import { Situacion } from '../../../business-logic/value-objects/situacion.vo';

@CommandHandler(RegistrarMovimientoCommand)
export class RegistrarMovimientoHandler
  implements ICommandHandler<RegistrarMovimientoCommand>
{
  constructor(
    @Inject(GUIAREPOSITORYINTERFACE)
    private readonly guiaRepository: GuiaRepositoryInterface,
  ) {}

  async execute(command: RegistrarMovimientoCommand): Promise<any> {
    // 1. construir los VO
    // 1.1 construyendo desde el exterior el numero de rastreo
    const numeroRastreoResult = NumeroDeRastreoVO.fromString(
      command.numeroDeRastreo,
    );
    if (numeroRastreoResult.isFailure()) {
      throw new BadRequestException(numeroRastreoResult.getError());
    }
    const numeroRastreo = numeroRastreoResult.getValue();

    // 1.2 construyendo desde el exterior el estado del envio
    const estadoResult = SituacionVO.create(command.estado as Situacion);
    if (estadoResult.isFailure()) {
      throw new BadRequestException(estadoResult.getError());
    }
    const estado = estadoResult.getValue();

    // 2. verificar que la guia existe en persistencia
    const guiaEncontrada =
      await this.guiaRepository.findByNumeroRastreo(numeroRastreo);
    if (!guiaEncontrada) {
      throw new NotFoundException('Guía no encontrada');
    }

    // 3. hidratar el VO para los movimientos
    const nuevoMovimientoResult = MovimientoDomainEntity.create({
      // estado ya esta validado
      estado: estado,
      // el resto se valida en el VO de los movimientos
      idRuta: command.idRuta,
      idSucursal: command.idSucursal,
      localizacion: command.localizacion,
    });
    if (nuevoMovimientoResult.isFailure()) {
      return Result.failure(nuevoMovimientoResult.getError());
    }
    const nuevoMovimiento = nuevoMovimientoResult.getValue();

    // 3. hacer el movimiento
    const guiaActualizada = guiaEncontrada.hacerMovimiento(nuevoMovimiento);

    // 4. persistir el movimiento
    await this.guiaRepository.save(guiaActualizada);

    // 5. emitir evento "movimientoGuiaDetectado" si aplica
  }
}
