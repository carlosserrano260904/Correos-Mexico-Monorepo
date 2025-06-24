export class CrearGuiaCommand {
    constructor(
        public readonly remitente: ContactoProps,
        public readonly destinatario: ContactoProps,
        public readonly dimensiones: DimensionesProps,
        public readonly peso: number,
        public readonly valorDeclarado: number
    ) { }
}

interface ContactoProps {
    nombres: string;
    apellidos: string;
    telefono: string;
    direccion: DireccionProps;
}

interface DireccionProps {
    calle: string;
    numero: string;
    ciudad: string;
    pais: string;
    codigoPostal: string;
    estado: string;
    municipio?: string;
    delegacion?: string;
    colonia?: string;
    fraccionamiento?: string;
}

interface DimensionesProps {
    alto_cm: number;
    ancho_cm: number;
    largo_cm: number;
}