import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ValidateCodeDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: '2PN529' })
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}
