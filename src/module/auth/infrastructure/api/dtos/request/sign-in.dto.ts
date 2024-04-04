import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class SignInDto extends CreateUserDto {
  @ApiProperty()
  @IsOptional()
  readonly userAgent?: string;
}
