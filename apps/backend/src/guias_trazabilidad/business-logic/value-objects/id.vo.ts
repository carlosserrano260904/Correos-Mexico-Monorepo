export class IdVO {
  private constructor(private readonly id: string) {}

  public static safeCreate(): IdVO {
    return new IdVO(crypto.randomUUID());
  }

  public static fromPersistence(id: string): IdVO {
    return new IdVO(id);
  }

  get getId(): string {
    return this.id;
  }
}
