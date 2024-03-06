import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';

@Injectable()
export abstract class IAuthRepository {
  abstract findUserByEmail(email: string): Promise<User>;
  abstract createUser(email: string, encryptedPassword: string): Promise<User>;
}
