import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GuiaRepositoryInterface } from '../../../application/ports/outbound/guia.repository.interface';
import { DataSource, Repository } from 'typeorm';
import { GuiaDomainEntity } from '../../../business-logic/guia.domain-entity-root';
import { GuiaTypeormEntity } from '../typeorm-entities/guia.typeorm-entity';
import { GuiaMapper } from '../../mappers/guia.mapper';
import { ContactosTypeormEntity } from '../typeorm-entities/contactos.typeorm-entity';
import { ContactoMapper } from '../../mappers/contacto.mapper';
import { MovimientoGuiasTypeormEntity } from '../typeorm-entities/movimientos-guias.typeorm-entity';
import { MovimientoMapper } from '../../mappers/movimiento.mapper';
import { NumeroDeRastreoVO } from '../../../business-logic/value-objects/numeroRastreo.vo';
import { IncidenciaMapper } from '../../mappers/incidencia.mapper';
import { IncidenciasTypeormEntity } from '../typeorm-entities/incidencias.typeorm-entity';

@Injectable()
export class GuiaRepository implements GuiaRepositoryInterface {
  constructor(
    @InjectRepository(GuiaTypeormEntity)
    private readonly guiaRepository: Repository<GuiaTypeormEntity>,

    @InjectRepository(ContactosTypeormEntity)
    private readonly contactosRepository: Repository<ContactosTypeormEntity>,

    @InjectRepository(MovimientoGuiasTypeormEntity)
    private readonly movimientoGuiaRepository: Repository<MovimientoGuiasTypeormEntity>,

    @InjectRepository(IncidenciasTypeormEntity)
    private readonly incidenciaRepository: Repository<IncidenciasTypeormEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async save(guia: GuiaDomainEntity): Promise<void> {
    await this.dataSource.transaction(async (EntityManager) => {
      const remitenteOrmEntity = ContactoMapper.toOrm(guia.Remitente);
      await this.contactosRepository.save(remitenteOrmEntity);

      const destinatarioOrmEntity = ContactoMapper.toOrm(guia.Destinatario);
      await this.contactosRepository.save(destinatarioOrmEntity);

      const guiaOrmEntity = GuiaMapper.toOrm(guia);
      await this.guiaRepository.save(guiaOrmEntity);

      if (guia.UltimoMovimiento) {
        const movimientoOrmEntity = MovimientoMapper.toOrm(
          guia.UltimoMovimiento,
        );
        movimientoOrmEntity.id_guia = guiaOrmEntity.id_guia; // TODO: refactorizar como en la incidencia, que acepta 2 parametros
        await this.movimientoGuiaRepository.save(movimientoOrmEntity);
      }

      if (guia.incidencia) {
        const incidenciaOrmEntity = IncidenciaMapper.toOrm(
          guia.incidencia,
          guia.Id.getId,
        );
        await this.incidenciaRepository.save(incidenciaOrmEntity);
      }
    });
  }

  async findByNumeroRastreo(
    numeroRastreo: NumeroDeRastreoVO,
  ): Promise<GuiaDomainEntity | null> {
    return await this.dataSource.transaction(async (EntityManager) => {
      const guiaOrmEntity = await EntityManager.findOne(GuiaTypeormEntity, {
        where: { numero_de_rastreo: numeroRastreo.getNumeroRastreo },
        relations: ['remitente', 'destinatario'],
      });

      if (!guiaOrmEntity) {
        return null;
        throw new Error('No se encontro ninguna guia');
      }

      const movimientoOrmEntity = await EntityManager.findOne(
        MovimientoGuiasTypeormEntity,
        {
          where: { id_guia: guiaOrmEntity.id_guia },
          order: { fecha_movimiento: 'DESC' }, // el mas nuevecito
        },
      );

      return GuiaMapper.toDomain(
        guiaOrmEntity,
        guiaOrmEntity.remitente,
        guiaOrmEntity.destinatario,
        movimientoOrmEntity ?? undefined,
      );
    });
  }
}
