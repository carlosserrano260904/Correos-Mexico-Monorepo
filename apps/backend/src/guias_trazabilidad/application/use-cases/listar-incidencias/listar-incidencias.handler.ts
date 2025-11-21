import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListarIncidenciasQuery } from './listar-incidencias.query';
import { Result } from '../../../../utils/result';
import { IncidenciaReadModel } from '../../read-models/guia.read-models';
import { GuiaReadRepositoryInterface, GUIA_READ_REPOSITORY } from '../../ports/outbound/guia-read.repository.interface';

@QueryHandler(ListarIncidenciasQuery)
export class ListarIncidenciasQueryHandler implements IQueryHandler<ListarIncidenciasQuery> {
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
  ) {}

  async execute(query: ListarIncidenciasQuery): Promise<Result<IncidenciaReadModel[]>> {
    try {
      const incidencias = await this.guiaReadRepository.findAllIncidencias();
      return Result.success(incidencias);
    } catch (error) {
      return Result.failure(`Error al listar incidencias: ${error.message}`);
    }
  }
} 