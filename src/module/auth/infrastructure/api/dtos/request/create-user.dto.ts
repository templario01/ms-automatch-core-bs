import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
