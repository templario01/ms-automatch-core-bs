import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class CreateUserDto extends UserEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
