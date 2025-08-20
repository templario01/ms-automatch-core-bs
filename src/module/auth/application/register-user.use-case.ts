import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/auth.repository';
import { User } from '../domain/entities/user';
import { CreateUser } from '../domain/entities/create-user';
import { AuthService } from './services/auth.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: CreateUser): Promise<User> {
    const { email, password } = data;
    const user = await this.userRepository.findUserByEmail(email);
    if (user?.hasConfirmedEmail === true) {
      throw new ConflictException('email already registered');
    }
    if (user?.hasConfirmedEmail === false) {
      throw new BadRequestException(
        'Please check your email, your verification code has already been sent',
      );
    }
    const encryptedPassword = await this.authService.encryptPassword(password);
    const newUser = await this.userRepository.createUser(
      email,
      encryptedPassword,
    );
    return newUser;
  }
}
