interface Props {
    alto_cm: number,
    ancho_cm: number,
    largo_cm: number,
    peso: number,
}

export class EmbalajeVO {
    private constructor(private readonly props: Props) {
        this.validate();
    }

    static create(props: Props): EmbalajeVO {
        return new EmbalajeVO(props)
    }

    static fromPersistence(props: Props): EmbalajeVO {
        return new EmbalajeVO(props)
    }

    //  TODO: validar que las dimenesiones no sean 0 o negativas
    validate() {
        // logica de validacion
    }

    get alto_cm(): number {
        return this.props.alto_cm
    }

    get largo_cm(): number {
        return this.props.largo_cm
    }

    get peso(): number {
        return this.props.peso
    }

    get ancho_cm(): number {
        return this.props.ancho_cm
    }

    calcularVolumen() {
        return this.props.alto_cm * this.props.ancho_cm * this.props.largo_cm
    }

    calcularPesoVolumetrico() {
        return this.calcularVolumen() / 6000
    }

    calcularPeso() {
        return this.props.peso
    }
}