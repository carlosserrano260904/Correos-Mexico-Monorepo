export class IdVO {
    private constructor(private readonly value: string) {
    }

    static create(): IdVO {
        return new IdVO(crypto.randomUUID());
    }

    static fromPersistence(value: string): IdVO {
        return new IdVO(value)
    }

    get id(): string {
        return this.value
    }

}