export class RegistrarMovimientoCommand {
  constructor(
    public readonly numeroDeRastreo: string,
    public readonly idSucursal: string,
    public readonly idRuta: string,
    public readonly estado: string,
    public readonly localizacion: string,
  ) {}
}
