import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendUserCodeDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
