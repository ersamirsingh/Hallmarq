export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]> | string[];
  public readonly code?: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]> | string[],
    code?: string
  ) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }
}
