import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CrearGuiaCommand,
  TipoServicio,
} from '../../../guias_trazabilidad/application/use-cases/crear-guia/crear-guia.command';

@Injectable()
export class PDFGeneratorCreateService {
  constructor(private readonly commandBus: CommandBus) {}

  async crearGuiaConDatos(
    remitente,
    destinatario,
    paquete,
    peso,
    valorDeclarado,
  ) {
    console.log('🔧 Creando comando con datos:', {
      remitente,
      destinatario,
      paquete,
      peso,
      valorDeclarado,
    });

    const command = new CrearGuiaCommand(
      remitente,
      destinatario,
      paquete,
      peso,
      valorDeclarado,
      TipoServicio.NACIONAL,
    );

    console.log('📤 Ejecutando comando...');
    const resultado = await this.commandBus.execute(command);
    console.log('📥 Resultado recibido:', resultado);

    return resultado; // { numeroRastreo, pdf }
  }
}
