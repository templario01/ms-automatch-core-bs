import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { AuthProvider } from '../entities/auth-provider';

@Injectable()
export abstract class IAuthRepository {
  abstract findUserByEmail(email: string): Promise<User>;
  abstract registerSession(id: string): Promise<void>;
  abstract createUser(email: string, encryptedPassword: string): Promise<User>;
  abstract createUserByExternalProvider(email: string, authProvider: AuthProvider): Promise<User>;
  abstract findUserWithActiveVerificationCode(
    email: string,
    code: string,
  ): Promise<User>;
  abstract validateAccount(id: string): Promise<User>;
}
