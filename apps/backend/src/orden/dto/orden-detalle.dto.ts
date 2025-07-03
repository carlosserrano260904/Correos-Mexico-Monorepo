export class OrdenDetalleDto {
  id: number;
  total: string;
  fecha: Date;
  usuario: {
    nombre: string;
  };
  direccion: {
    estado: string;
    ciudad: string;
    codigoPostal: string;
    colonia: string;
  };
  productos: {
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
}
