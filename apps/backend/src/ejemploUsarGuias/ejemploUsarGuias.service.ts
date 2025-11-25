import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CrearGuiaCommand } from "../guias_trazabilidad/application/use-cases/crear-guia/crear-guia.command";
import { TipoServicio } from "../guias_trazabilidad/application/use-cases/crear-guia/crear-guia.command";

@Injectable()
export class EjemploUsarGuiasService {
    constructor(private readonly commandBus: CommandBus) { }

    async crearGuia() { // <-- si quieres usar el dto que hice para el controller, puedes usarlo aqui y se ajusta a lo que va dentro de newCrearGuiaCommand({aqui})
        const command = new CrearGuiaCommand({
            nombres: 'ejemplo',
            apellidos: 'otro ejemplo',
            telefono: '1234567890',
            direccion: {
                calle: 'Diamante',
                numero: '328',
                numeroInterior: '',
                asentamiento: 'Joyas del valle',
                codigoPostal: '34237',
                localidad: 'Durango',
                estado: 'Durango',
                pais: 'Mexico'
            }
        }, {
            nombres: 'ejemplo',
            apellidos: 'otro ejemplo',
            telefono: '1234567890',
            direccion: {
                calle: 'Invierno',
                numero: '112',
                numeroInterior: '',
                asentamiento: 'Villas del sol',
                codigoPostal: '34237',
                localidad: 'Durango',
                estado: 'Durango',
                pais: 'Mexico'
            }
        }, {
            alto_cm: 10,
            ancho_cm: 10,
            largo_cm: 10
        }, 10, 10, TipoServicio.NACIONAL)

        const resultado = await this.commandBus.execute(command);
        return resultado; // <-- retorna un buffer, se puede ver en postman si esta funcion la retornas directamente en el controlador
        /*
        el objeto que devuelv es:
        { numeroRastreo: string; pdf: Buffer }
         */
    }
}