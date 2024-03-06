import { createHash, randomBytes } from 'crypto';

export class AuthService {
  public static encryptPassword(pass: string): string {
    const salt = AuthService.generateSalt();
    const hashedPassword = AuthService.hashPassword(pass, salt);
    return hashedPassword;
  }

  public static comparePasswords(
    inputPassword: string,
    hashedPassword: string,
    salt: string,
  ): boolean {
    const inputHashedPassword = AuthService.hashPassword(inputPassword, salt);
    return inputHashedPassword === hashedPassword;
  }

  private static generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  private static hashPassword(password: string, salt: string): string {
    const hash = createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
  }
}
