import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ObtenerGuiaPorNumeroQuery } from './obtener-guia-por-numero.query';
import { Result } from '../../../../utils/result';
import { TrazabilidadReadModel } from '../../read-models/guia.read-models';
import {
  GuiaReadRepositoryInterface,
  GUIA_READ_REPOSITORY,
} from '../../ports/outbound/guia-read.repository.interface';

@QueryHandler(ObtenerGuiaPorNumeroQuery)
export class ObtenerGuiaPorNumeroQueryHandler
  implements IQueryHandler<ObtenerGuiaPorNumeroQuery>
{
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
  ) {}

  async execute(
    query: ObtenerGuiaPorNumeroQuery,
  ): Promise<Result<TrazabilidadReadModel>> {
    try {
      const guia = await this.guiaReadRepository.findByNumeroRastreo(
        query.numeroRastreo,
      );

      if (!guia) {
        return Result.failure(
          `Guía con número ${query.numeroRastreo} no encontrada`,
        );
      }

      return Result.success(guia);
    } catch (error) {
      return Result.failure(`Error al buscar guía: ${error.message}`);
    }
  }
}
