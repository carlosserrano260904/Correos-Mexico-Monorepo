export class Result<T> {
  private constructor(
    private readonly isSuccess: boolean,
    private readonly error?: string,
    private readonly value?: T,
  ) {}

  public static success<T>(value: T): Result<T> {
    return new Result<T>(true, undefined, value);
  }

  public static failure<T>(error: string): Result<T> {
    return new Result<T>(false, error, undefined);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of failure result');
    }
    return this.value!;
  }

  public isFailure(): boolean {
    return !this.isSuccess;
  }

  public getError(): string {
    return this.error!;
  }
}
