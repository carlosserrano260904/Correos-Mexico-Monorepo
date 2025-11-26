export interface GeocodingRequestDto {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  asentamiento: string;
  codigoPostal: string;
  localidad: string;
  estado: string;
  pais: string;
}
