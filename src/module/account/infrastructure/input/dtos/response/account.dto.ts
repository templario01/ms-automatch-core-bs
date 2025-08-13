import { ApiProperty } from '@nestjs/swagger';
import { FavoriteVehicleDto } from './favorite-vehicle.dto';

export class AccountDto {
  @ApiProperty({
    description: 'ID of Automatch Account',
    example: '6a0d296d-e93f-4a92-b7e6-6047fca6e361',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Flag to determine whether to send an email notification',
    example: 'false',
  })
  readonly hasActiveNotifications: boolean;

  @ApiProperty({
    description: 'Date of affiliation',
    example: '',
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: FavoriteVehicleDto,
    description: 'List of favorite vehicles',
  })
  readonly favoriteVehicles?: FavoriteVehicleDto[];
}
