export class NumeroSeguimientoVO {
    private constructor(private readonly value: string) {
    }

    static create(): NumeroSeguimientoVO {
        //  TODO: desarrollar el algoritmo real para generar el numero de seguimiento
        return new NumeroSeguimientoVO(crypto.randomUUID())
    }

    static fromPersistence(value: string): NumeroSeguimientoVO {
        return new NumeroSeguimientoVO(value)
    }

    static fromString(value: string): NumeroSeguimientoVO {
        return new NumeroSeguimientoVO(value)
    }

    toString(): string {
        return this.value
    }

    get numeroSeguimiento(): string {
        return this.value
    }
}