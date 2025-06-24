import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { GuiaRepositoryInterface } from "src/guias_trazabilidad/application/ports/outbound/guia.repository.interface";
import { DataSource, EntityManager, Repository } from "typeorm";
import { GuiaDomainEntity } from "src/guias_trazabilidad/business-logic/guia.domain-entity-root";
import { GuiaTypeormEntity } from "../typeorm-entities/guia.typeorm-entity";
import { GuiaMapper } from "../../mappers/guia.mapper";
import { ContactosTypeormEntity } from "../typeorm-entities/contactos.typeorm-entity";
import { ContactoMapper } from "../../mappers/contacto.mapper";
import { MovimientoGuiasTypeormEntity } from "../typeorm-entities/movimientos-guias.typeorm-entity";
import { MovimientoMapper } from "../../mappers/movimiento.mapper";
import { NumeroSeguimientoVO } from "src/guias_trazabilidad/business-logic/value-objects/numeroSeguimiento.vo";

@Injectable()
export class GuiaRepository implements GuiaRepositoryInterface {

    constructor(
        @InjectRepository(GuiaTypeormEntity)
        private readonly guiaRepository: Repository<GuiaTypeormEntity>,

        @InjectRepository(ContactosTypeormEntity)
        private readonly contactosRepository: Repository<ContactosTypeormEntity>,

        @InjectRepository(MovimientoGuiasTypeormEntity)
        private readonly movimientoGuiaRepository: Repository<MovimientoGuiasTypeormEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async save(guia: GuiaDomainEntity): Promise<void> {
        await this.dataSource.transaction(async (EntityManager) => {
            const remitenteOrmEntity = ContactoMapper.toOrm(guia.remitente)
            await this.contactosRepository.save(remitenteOrmEntity)

            const destinatarioOrmEntity = ContactoMapper.toOrm(guia.destinatario)
            await this.contactosRepository.save(destinatarioOrmEntity)

            const guiaOrmEntity = GuiaMapper.toOrm(guia, remitenteOrmEntity.id_contacto, destinatarioOrmEntity.id_contacto)
            await this.guiaRepository.save(guiaOrmEntity)

            if (guia.ultimoMovimiento) {
                const movimientoOrmEntity = MovimientoMapper.toOrm(guia.ultimoMovimiento)
                movimientoOrmEntity.id_guia = guiaOrmEntity.id_guia
                await this.movimientoGuiaRepository.save(movimientoOrmEntity)
            }
        })
    }

    async findByNumeroSeguimiento(numeroSeguimiento: NumeroSeguimientoVO): Promise<GuiaDomainEntity | null> {
        return await this.dataSource.transaction(async (EntityManager) => {
            const guiaOrmEntity = await EntityManager.findOne(GuiaTypeormEntity, {
                where: { numero_seguimiento: numeroSeguimiento.numeroSeguimiento },
                relations: ['remitente', 'destinatario']
            });

            if (!guiaOrmEntity) {
                return null
                throw new Error("No se encontro ninguna guia")
            };

            const movimientoOrmEntity = await EntityManager.findOne(MovimientoGuiasTypeormEntity, {
                where: { id_guia: guiaOrmEntity.id_guia },
                order: { fecha_movimiento: 'DESC' } // el mas nuevecito
            });

            return GuiaMapper.toDomain(
                guiaOrmEntity,
                guiaOrmEntity.remitente,
                guiaOrmEntity.destinatario,
                movimientoOrmEntity ?? undefined
            )
        })
    }
}