import { IQuery } from '@nestjs/cqrs';

export class ObtenerGuiaPorNumeroQuery implements IQuery {
  constructor(public readonly numeroRastreo: string) {}
}
