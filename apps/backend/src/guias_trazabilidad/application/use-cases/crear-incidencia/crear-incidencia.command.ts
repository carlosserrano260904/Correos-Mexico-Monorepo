export class CrearIncidenciaCommand {
  constructor(
    public readonly numeroRastreo: string,
    public readonly tipoIncidencia: string,
    public readonly descripcion: string,
    public readonly idResponsable: string,
  ) {}
}
