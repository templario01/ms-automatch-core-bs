import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleSignInDto } from '../dtos/request/google-sign-in.dto';
import { SignInWithGoogleUseCase } from '../../../application/sign-in-with-google.use-case';
import { AccessTokenDto } from '../dtos/response/access-token.dto';

@ApiTags('auth')
@Controller('auth')
export class GoogleAuthController {
  constructor(
    private readonly signInWithGoogleUseCase: SignInWithGoogleUseCase,
  ) {}

  @ApiOperation({ summary: 'Login with Google' })
  @ApiOkResponse({
    type: AccessTokenDto,
  })
  @Post('google')
  async googleLogin(@Body() data: GoogleSignInDto): Promise<AccessTokenDto> {
    return this.signInWithGoogleUseCase.execute(data);
  }
}
