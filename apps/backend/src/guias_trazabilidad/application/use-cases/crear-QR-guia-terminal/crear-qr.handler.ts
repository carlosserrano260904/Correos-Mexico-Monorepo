import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CrearQRCommand } from './crear-qr.command';
import {
  QR_GENERATOR_REPOSITORY,
  QRGeneratorRepositoryInterface,
} from '../../ports/outbound/qr-generator.repository.interface';
import { Inject } from '@nestjs/common';

@CommandHandler(CrearQRCommand)
export class CrearQRCommandHandler implements ICommandHandler<CrearQRCommand> {
  constructor(
    @Inject(QR_GENERATOR_REPOSITORY)
    private readonly qrRepository: QRGeneratorRepositoryInterface,
  ) {}

  async execute(command: CrearQRCommand): Promise<any> {
    const qrPayload = { ...command };

    const result =
      await this.qrRepository.generarQRComoTextoEnConsola(qrPayload);

    if (result.isFailure()) {
      console.log(result.getError());
    }

    console.log('QR de prueba');
    console.log(result.getValue());
  }
}
