interface Props {
    calle: string,
    numero: string,
    ciudad: string,
    pais: string,
    codigoPostal: string,
    estado: string,
    municipio?: string,
    delegacion?: string,
    colonia?: string,
    fraccionamiento?: string,
}

// esta verificacion de mutua segregacion se delego al create-guia.handler.ts
// type MunicipioDelegacion = | { municipio: string, delegacion?: never } | { municipio?: never, delegacion: string }
// type ColoniaFraccionamiento = | { colonia: string, fraccionamiento?: never } | { colonia?: never, fraccionamiento: string }

// type Props = baseProps & MunicipioDelegacion & ColoniaFraccionamiento;

export class DireccionVO {
    private constructor(private readonly props: Props) {
    }

    static create(props: Props): DireccionVO {
        if (!props.municipio && !props.delegacion) {
            throw new Error('Debe proporcionar municipio o delegación');
        }
        if (props.municipio && props.delegacion) {
            throw new Error('No puede proporcionar ambos: municipio y delegación');
        }

        if (!props.colonia && !props.fraccionamiento) {
            throw new Error('Debe proporcionar colonia o fraccionamiento');
        }
        if (props.colonia && props.fraccionamiento) {
            throw new Error('No puede proporcionar ambos: colonia y fraccionamiento');
        }

        return new DireccionVO(props)
    }

    static fromPersistence(props: Props): DireccionVO {
        return new DireccionVO(props)
    }

    get calle(): string {
        return this.props.calle
    }

    get numero(): string {
        return this.props.numero
    }

    get ciudad(): string {
        return this.props.ciudad
    }

    get pais(): string {
        return this.props.pais
    }

    get codigoPostal(): string {
        return this.props.codigoPostal
    }

    get estado(): string {
        return this.props.estado
    }

    get municipio(): string | undefined {
        return this.props.municipio
    }

    get delegacion(): string | undefined {
        return this.props.delegacion
    }

    get colonia(): string | undefined {
        return this.props.colonia
    }

    get fraccionamiento(): string | undefined {
        return this.props.fraccionamiento
    }

}