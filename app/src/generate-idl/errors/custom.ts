export type CustomError = InvalidInput

export class InvalidInput extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "InvalidInput"

  constructor(readonly logs?: string[]) {
    super("6000: ")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidInput(logs)
  }

  return null
}
