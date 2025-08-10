export class VerifyAuthCode {
  readonly email: string;
  readonly code: string;

  constructor(email: string, code: string) {
    this.email = email;
    this.code = code;
  }

  static fromDto(dto: { email: string; code: string }): VerifyAuthCode {
    return new VerifyAuthCode(dto.email, dto.code);
  }
}