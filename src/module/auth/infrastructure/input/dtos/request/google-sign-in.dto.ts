import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDto {
  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  readonly idToken: string;
}
