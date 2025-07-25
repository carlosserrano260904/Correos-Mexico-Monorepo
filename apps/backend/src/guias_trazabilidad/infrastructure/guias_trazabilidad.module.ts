import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

// Command Handlers
import { CrearGuiaCommandHandler } from "../application/use-cases/crear-guia/crear-guia.handler";
import { RegistrarMovimientoHandler } from "../application/use-cases/registrar-movimiento/registrar-movimiento.handler";
import { CrearIncidenciaHandler } from "../application/use-cases/crear-incidencia/crear-incidencia.handler";
import { CrearQRCommandHandler } from "../application/use-cases/crear-QR-guia-terminal/crear-qr.handler";

// Query Handlers
import { ObtenerGuiaPorNumeroQueryHandler } from "../application/use-cases/obtener-guia-por-numero/obtener-guia-por-numero.handler";
import { ListarGuiasQueryHandler } from "../application/use-cases/listar-guias/listar-guias.handler";
import { ListarIncidenciasQueryHandler } from "../application/use-cases/listar-incidencias/listar-incidencias.handler";
import { ListarContactosQueryHandler } from "../application/use-cases/listar-contactos/listar-contactos.handler";

// Controllers
import { GuiaController } from "./controllers/guia.controller";

// Repositories & interfaces
import { GUIAREPOSITORYINTERFACE } from "../application/ports/outbound/guia.repository.interface";
import { GuiaRepository } from "./persistence/repositories/guia.repository";
import { GUIA_READ_REPOSITORY } from "../application/ports/outbound/guia-read.repository.interface";
import { GuiaReadRepository } from "./persistence/repositories/guia-read.repository";
import { QR_GENERATOR_REPOSITORY } from "../application/ports/outbound/qr-generator.repository.interface";
import { QRGeneratorRepository } from "./qr-generator/qr-generator.repository";
import { PDF_GENERATOR_REPOSITORY_INTERFACE } from "../application/ports/outbound/pdf-generator.repository.interface";
import { PDFGeneratorRepository } from "./pdf-generator/pdf-generator.repository";

// TypeORM Entities
import { GuiaTypeormEntity } from "./persistence/typeorm-entities/guia.typeorm-entity";
import { ContactosTypeormEntity } from "./persistence/typeorm-entities/contactos.typeorm-entity";
import { MovimientoGuiasTypeormEntity } from "./persistence/typeorm-entities/movimientos-guias.typeorm-entity";
import { IncidenciasTypeormEntity } from "./persistence/typeorm-entities/incidencias.typeorm-entity";
import { GOOGLE_GEOCODE_REPOSITORY_INTERFACE } from "../application/ports/outbound/geocode.repository.interface";
import { GoogleGeocodeRepository } from "./google-geocode/google-geocode.repository";

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
        // Command Handlers (Escritura)
        CrearGuiaCommandHandler,
        RegistrarMovimientoHandler,
        CrearIncidenciaHandler,
        CrearQRCommandHandler,

        // Query Handlers (Lectura)
        ObtenerGuiaPorNumeroQueryHandler,
        ListarGuiasQueryHandler,
        ListarIncidenciasQueryHandler,
        ListarContactosQueryHandler,

        // Repositories
        {
            provide: GUIAREPOSITORYINTERFACE,
            useClass: GuiaRepository
        },
        {
            provide: GUIA_READ_REPOSITORY,
            useClass: GuiaReadRepository
        },
        {
            provide: QR_GENERATOR_REPOSITORY,
            useClass: QRGeneratorRepository
        },
        {
            provide: PDF_GENERATOR_REPOSITORY_INTERFACE,
            useClass: PDFGeneratorRepository
        },
        {
            provide: GOOGLE_GEOCODE_REPOSITORY_INTERFACE,
            useClass: GoogleGeocodeRepository
        }
    ]
})
export class GuiasTrazabilidadModule { }
