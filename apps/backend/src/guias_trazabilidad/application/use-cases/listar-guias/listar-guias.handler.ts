import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListarGuiasQuery } from './listar-guias.query';
import { Result } from '../../../../utils/result';
import { GuiaListReadModel } from '../../read-models/guia.read-models';
import { GuiaReadRepositoryInterface, GUIA_READ_REPOSITORY } from '../../ports/outbound/guia-read.repository.interface';

@QueryHandler(ListarGuiasQuery)
export class ListarGuiasQueryHandler implements IQueryHandler<ListarGuiasQuery> {
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
  ) {}

  async execute(query: ListarGuiasQuery): Promise<Result<GuiaListReadModel[]>> {
    try {
      const guias = await this.guiaReadRepository.findAllGuias();
      return Result.success(guias);
    } catch (error) {
      return Result.failure(`Error al listar guías: ${error.message}`);
    }
  }
} 