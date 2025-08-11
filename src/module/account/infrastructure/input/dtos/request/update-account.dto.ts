import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  @IsNotEmpty()
  readonly hasActiveNotifications: boolean;
}
