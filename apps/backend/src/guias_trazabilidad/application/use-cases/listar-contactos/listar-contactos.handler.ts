import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListarContactosQuery } from './listar-contactos.query';
import { Result } from '../../../../utils/result';
import { ContactoReadModel } from '../../read-models/guia.read-models';
import { GuiaReadRepositoryInterface, GUIA_READ_REPOSITORY } from '../../ports/outbound/guia-read.repository.interface';

@QueryHandler(ListarContactosQuery)
export class ListarContactosQueryHandler implements IQueryHandler<ListarContactosQuery> {
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
  ) {}

  async execute(query: ListarContactosQuery): Promise<Result<ContactoReadModel[]>> {
    try {
      const contactos = await this.guiaReadRepository.findAllContactos();
      return Result.success(contactos);
    } catch (error) {
      return Result.failure(`Error al listar contactos: ${error.message}`);
    }
  }
} 