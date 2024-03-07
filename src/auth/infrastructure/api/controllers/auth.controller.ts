import { Body, Controller, Post } from '@nestjs/common';
import { AuthUseCase } from '../../../application/auth.use-case';
import { CreateUserDto } from '../dtos/create-user';
import { ValidateCodeDto } from '../dtos/validate-code';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('sign-up')
  async signUp(@Body() createUser: CreateUserDto) {
    return this.authUseCase.register(createUser);
  }

  @Post('validate-code')
  async validateCode(@Body() validateCode: ValidateCodeDto) {
    return this.authUseCase.confirmAccount(validateCode.code);
  }
}
