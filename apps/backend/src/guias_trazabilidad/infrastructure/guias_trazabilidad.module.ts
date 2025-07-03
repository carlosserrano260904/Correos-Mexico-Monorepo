import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CrearGuiaCommandHandler } from "../application/use-cases/crear-guia/crear-guia.handler";
import { RegistrarMovimientoHandler } from "../application/use-cases/registrar-movimiento/registrar-movimiento.handler";
import { CrearIncidenciaHandler } from "../application/use-cases/crear-incidencia/crear-incidencia.handler";

import { GuiaController } from "./controllers/guia.controller";
import { GUIAREPOSITORYINTERFACE } from "../application/ports/outbound/guia.repository.interface";
import { GuiaRepository } from "./persistence/repositories/guia.repository";
import { GuiaTypeormEntity } from "./persistence/typeorm-entities/guia.typeorm-entity";
import { ContactosTypeormEntity } from "./persistence/typeorm-entities/contactos.typeorm-entity";
import { MovimientoGuiasTypeormEntity } from "./persistence/typeorm-entities/movimientos-guias.typeorm-entity";
import { IncidenciasTypeormEntity } from "./persistence/typeorm-entities/incidencias.typeorm-entity";


@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([
            GuiaTypeormEntity,
            ContactosTypeormEntity,
            MovimientoGuiasTypeormEntity,
            IncidenciasTypeormEntity
        ])
    ],
    controllers: [GuiaController],
    providers: [
        CrearGuiaCommandHandler,
        RegistrarMovimientoHandler,
        CrearIncidenciaHandler,
        {
            provide: GUIAREPOSITORYINTERFACE,
            useClass: GuiaRepository
        }
    ]
})
export class GuiasTrazabilidadModule { }