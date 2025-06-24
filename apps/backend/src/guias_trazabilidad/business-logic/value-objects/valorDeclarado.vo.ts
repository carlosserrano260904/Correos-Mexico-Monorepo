export class ValorDeclaradoVO {
    private constructor(private readonly value: number) {

    }

    static create(value: number): ValorDeclaradoVO {
        return new ValorDeclaradoVO(value)
    }

    // se duplican pero es para semantica
    static fromPersistence(value: number): ValorDeclaradoVO {
        return new ValorDeclaradoVO(value)
    }

    //  TODO: validar que el valor declarado no sea 0 o negativo
    private validate() {
        // logica validacion
    }

    get valorDeclarado(): number {
        return this.value
    }
}