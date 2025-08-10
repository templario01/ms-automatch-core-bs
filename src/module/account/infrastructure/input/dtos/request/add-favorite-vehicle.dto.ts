import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavoriteVehicleDto {
  @ApiProperty({ example: '6855b2f1d424d3fc9622d442' })
  @IsString()
  @IsNotEmpty()
  readonly vehicleId: string;
}
