import { Body, Controller, Post } from '@nestjs/common';
import { AuthUseCase } from '../../../application/auth.use-case';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { ValidateCodeDto } from '../dtos/request/validate-code.dto';
import { VerificationCodeDto } from '../dtos/response/verification-code.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenDto } from '../dtos/response/access-token.dto';
import { SignInDto } from '../dtos/request/sign-in.dto';
import { ResendUserCodeDto } from '../dtos/request/resend-user-code.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    type: VerificationCodeDto,
  })
  @Post('sign-up')
  async signUp(
    @Body() createUser: CreateUserDto,
  ): Promise<VerificationCodeDto> {
    return this.authUseCase.register(createUser);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    type: AccessTokenDto,
  })
  @Post('sign-in')
  async signIn(@Body() user: SignInDto): Promise<AccessTokenDto> {
    return this.authUseCase.login(user);
  }

  @ApiOperation({ summary: 'Verify user' })
  @ApiOkResponse({
    type: AccessTokenDto,
  })
  @Post('validate-code')
  async validateCode(
    @Body() validateCode: ValidateCodeDto,
  ): Promise<AccessTokenDto> {
    return this.authUseCase.confirmAccount(validateCode.code);
  }

  @ApiOperation({ summary: 'Resend verification code' })
  @ApiCreatedResponse({
    type: VerificationCodeDto,
  })
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() { email }: ResendUserCodeDto,
  ): Promise<VerificationCodeDto> {
    return this.authUseCase.resendEmailVerification(email);
  }
}
