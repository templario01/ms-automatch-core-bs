import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResendAuthVerificationCodeUseCase } from '../../../application/resend-auth-verification-code.use-case';
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
import { RegisterUserUseCase } from '../../../application/register-user.use-case';
import { SendAuthVerificationCodeUseCase } from '../../../application/send-auth-verification-code.use-case';
import { LoginUserUseCase } from '../../../application/login-user.use-case';
import { ConfirmAccountUseCase } from '../../../application/confirm-account.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly resendAuthVerificationCodeUseCase: ResendAuthVerificationCodeUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly sendAuthVerificationCodeUseCase: SendAuthVerificationCodeUseCase,
    private readonly confirmAccountUseCase: ConfirmAccountUseCase,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    type: VerificationCodeDto,
  })
  @Post('sign-up')
  async signUp(
    @Body() createUser: CreateUserDto,
  ): Promise<VerificationCodeDto> {
    const user = await this.registerUserUseCase.execute(createUser);
    return this.sendAuthVerificationCodeUseCase.execute(user.email);
  }

  @ApiOperation({ summary: 'Verify user' })
  @ApiOkResponse({
    type: AccessTokenDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('validate-code')
  async validateCode(
    @Body() validateCode: ValidateCodeDto,
  ): Promise<AccessTokenDto> {
    return this.confirmAccountUseCase.execute(validateCode);
  }

  @ApiOperation({ summary: 'Resend verification code' })
  @ApiCreatedResponse({
    type: VerificationCodeDto,
  })
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() { email }: ResendUserCodeDto,
  ): Promise<VerificationCodeDto> {
    return this.resendAuthVerificationCodeUseCase.execute(email);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    type: AccessTokenDto,
  })
  @Post('sign-in')
  async signIn(@Body() user: SignInDto): Promise<AccessTokenDto> {
    return this.loginUserUseCase.execute(user);
  }
}
