import { Result } from "../../../utils/result";

interface DireccionProps {
    calle: string;
    numero: string;
    numeroInterior?: string; // podria haber una casa con numero interior
    ciudad: string;
    pais: string;
    codigoPostal: string;
    estado: string;
    municipioDelegacion: string;
    asentamiento?: string; // podria haber comunidades donde no hay asentamiento
    referencia?: string; // podria haber una referencia de la direccion
}


// type Props = baseProps & MunicipioDelegacion & ColoniaFraccionamiento;

export class DireccionVO {
    private constructor(private readonly props: DireccionProps) { }

    public static safeCreate(props: DireccionProps): DireccionVO {
        return new DireccionVO(props)
    }

    public static create(props: DireccionProps): Result<DireccionVO> {
        return Result.success(new DireccionVO(props)) 
    }

    public static fromPersistence(props: DireccionProps): DireccionVO {
        return new DireccionVO(props)
    }

    get getCalle(): string {
        return this.props.calle
    }

    get getNumero(): string {
        return this.props.numero
    }

    get getCiudad(): string {
        return this.props.ciudad
    }

    get getPais(): string {
        return this.props.pais
    }

    get getCodigoPostal(): string {
        return this.props.codigoPostal
    }

    get getEstado(): string {
        return this.props.estado
    }

    get getMunicipioDelegacion(): string {
        return this.props.municipioDelegacion
    }

    get getAsentamiento(): string | undefined {
        return this.props.asentamiento
    }

    get getReferencia(): string | undefined {
        return this.props.referencia
    }

    get getNumeroInterior(): string | undefined {
        return this.props.numeroInterior
    }
}