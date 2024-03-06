import { Body, Controller, Post } from '@nestjs/common';
import { AuthUseCase } from '../../../application/auth.use-case';
import { CreateUserDto } from '../dtos/create-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post()
  async signUp(@Body() createUser: CreateUserDto) {
    return this.authUseCase.register(createUser);
  }
}
