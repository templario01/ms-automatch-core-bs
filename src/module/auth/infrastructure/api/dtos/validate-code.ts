import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ValidateCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}
