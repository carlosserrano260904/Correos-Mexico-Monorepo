import { BadRequestException, Inject } from "@nestjs/common";
import { GUIAREPOSITORYINTERFACE, GuiaRepositoryInterface } from "../../ports/outbound/guia.repository.interface";
import { CrearGuiaCommand } from "./crear-guia.command";
import { GuiaDomainEntity } from "../../../business-logic/guia.domain-entity-root";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ContactoVO } from "src/guias_trazabilidad/business-logic/value-objects/contacto.vo";
import { EmbalajeVO } from "../../../business-logic/value-objects/embalaje.vo";
import { DireccionVO } from "../../../business-logic/value-objects/direccion.vo";
import { ValorDeclaradoVO } from "../../../business-logic/value-objects/valorDeclarado.vo";

@CommandHandler(CrearGuiaCommand)
export class CrearGuiaCommandHandler implements ICommandHandler<CrearGuiaCommand> {

    constructor(
        @Inject(GUIAREPOSITORYINTERFACE)
        private readonly guiaRepository: GuiaRepositoryInterface
    ) { }

    async execute(command: CrearGuiaCommand): Promise<void> {

        // validacion segregacion de direcciones
        if (
            (!command.remitente.direccion.municipio && !command.remitente.direccion.delegacion) ||
            (command.remitente.direccion.municipio && command.remitente.direccion.delegacion)
        ) {
            throw new BadRequestException('Debe especificar solo municipio o delegación');
        }

        if (
            (!command.remitente.direccion.colonia && !command.remitente.direccion.fraccionamiento) ||
            (command.remitente.direccion.colonia && command.remitente.direccion.fraccionamiento)
        ) {
            throw new BadRequestException('Debe especificar solo colonia o fraccionamiento');
        }

        if (
            (!command.destinatario.direccion.municipio && !command.destinatario.direccion.delegacion) ||
            (command.destinatario.direccion.municipio && command.destinatario.direccion.delegacion)
        ) {
            throw new BadRequestException('Debe especificar solo municipio o delegación');
        }

        if (
            (!command.destinatario.direccion.colonia && !command.destinatario.direccion.fraccionamiento) ||
            (command.destinatario.direccion.colonia && command.destinatario.direccion.fraccionamiento)
        ) {
            throw new BadRequestException('Debe especificar solo colonia o fraccionamiento');
        }
        // fin validacino segregacion de direcciones

        // mapper
        const direccionRemitente = DireccionVO.create({
            calle: command.remitente.direccion.calle,
            numero: command.remitente.direccion.numero,
            ciudad: command.remitente.direccion.ciudad,
            pais: command.remitente.direccion.pais,
            codigoPostal: command.remitente.direccion.codigoPostal,
            estado: command.remitente.direccion.estado,
            municipio: command.remitente.direccion.municipio,
            delegacion: command.remitente.direccion.delegacion,
            colonia: command.remitente.direccion.colonia,
            fraccionamiento: command.remitente.direccion.fraccionamiento,
        });

        const remitente = ContactoVO.create({
            nombres: command.remitente.nombres,
            apellidos: command.remitente.apellidos,
            telefono: command.remitente.telefono,
            direccion: direccionRemitente
        })

        const direccionDestinatario = DireccionVO.create({
            calle: command.destinatario.direccion.calle,
            numero: command.destinatario.direccion.numero,
            ciudad: command.destinatario.direccion.ciudad,
            pais: command.destinatario.direccion.pais,
            codigoPostal: command.destinatario.direccion.codigoPostal,
            estado: command.destinatario.direccion.estado,
            municipio: command.destinatario.direccion.municipio,
            delegacion: command.destinatario.direccion.delegacion,
            colonia: command.destinatario.direccion.colonia,
            fraccionamiento: command.destinatario.direccion.fraccionamiento,
        })

        const destinatario = ContactoVO.create({
            nombres: command.destinatario.nombres,
            apellidos: command.destinatario.apellidos,
            telefono: command.destinatario.telefono,
            direccion: direccionDestinatario
        })

        const embalaje = EmbalajeVO.create({
            alto_cm: command.dimensiones.alto_cm,
            ancho_cm: command.dimensiones.ancho_cm,
            largo_cm: command.dimensiones.largo_cm,
            peso: command.peso
        })

        const valorDeclarado = ValorDeclaradoVO.create(command.valorDeclarado)

        const guia = GuiaDomainEntity.create({
            remitente: remitente,
            destinatario: destinatario,
            embalaje: embalaje,
            valorDeclarado: valorDeclarado,
        })
        // fin mapper

        // persistencia
        await this.guiaRepository.save(guia)

    }
}