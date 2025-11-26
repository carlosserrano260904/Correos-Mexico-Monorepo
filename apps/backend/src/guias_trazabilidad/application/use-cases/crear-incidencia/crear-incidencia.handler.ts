import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CrearIncidenciaCommand } from './crear-incidencia.command';
import { IncidenciaDomainEntity } from '../../../business-logic/incidencias.entity';
import { TipoIncidenciaVO } from '../../../business-logic/value-objects/tipoIncidencia.vo';
import { Incidencias } from '../../../business-logic/value-objects/tipoIncidencia.vo';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import {
  GuiaRepositoryInterface,
  GUIAREPOSITORYINTERFACE,
} from '../../ports/outbound/guia.repository.interface';
import { NumeroDeRastreoVO } from '../../../business-logic/value-objects/numeroRastreo.vo';

@CommandHandler(CrearIncidenciaCommand)
export class CrearIncidenciaHandler
  implements ICommandHandler<CrearIncidenciaCommand>
{
  constructor(
    @Inject(GUIAREPOSITORYINTERFACE)
    private readonly guiaRepository: GuiaRepositoryInterface,
  ) {}

  async execute(command: CrearIncidenciaCommand): Promise<any> {
    // 1. mapear command a VO

    const tipoIncidenciaResult = TipoIncidenciaVO.create(
      command.tipoIncidencia as Incidencias,
    );
    if (tipoIncidenciaResult.isFailure()) {
      throw new BadRequestException(tipoIncidenciaResult.getError());
    }
    const tipoIncidencia = tipoIncidenciaResult.getValue();

    const incidenciaResult = IncidenciaDomainEntity.create({
      tipoIncidencia: tipoIncidencia,
      descripcion: command.descripcion,
      idResponsable: command.idResponsable,
    });
    if (incidenciaResult.isFailure()) {
      throw new BadRequestException(incidenciaResult.getError());
    }
    const incidencia = incidenciaResult.getValue();
    // 2. hidratar guia

    const numeroRastreoResult = NumeroDeRastreoVO.fromString(
      command.numeroRastreo,
    );
    if (numeroRastreoResult.isFailure()) {
      throw new BadRequestException(numeroRastreoResult.getError());
    }
    const numeroRastreo = numeroRastreoResult.getValue();

    const guiaEncontrada =
      await this.guiaRepository.findByNumeroRastreo(numeroRastreo); // aqui tengo la duda
    // 3. validar si guia existe
    if (!guiaEncontrada) {
      throw new NotFoundException(
        `El numero de rastreo ${command.numeroRastreo} no fue encontrado.`,
      );
    }
    // 4. registrar la incidencia
    const nuevaGuia = guiaEncontrada.registrarIncidencia(incidencia);
    // 5. persistir la guia
    await this.guiaRepository.save(nuevaGuia);
  }
}
