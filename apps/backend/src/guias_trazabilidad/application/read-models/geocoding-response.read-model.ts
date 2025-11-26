export interface CoordenadasReadModel {
  readonly latitud: number;
  readonly longitud: number;
  readonly direccionFormateada: string;
  readonly precision:
    | 'ROOFTOP'
    | 'RANGE_INTERPOLATED'
    | 'GEOMETRIC_CENTER'
    | 'APPROXIMATE';
  readonly exitoso: boolean;
}
