import { ApiProperty } from '@nestjs/swagger';

export class FavoriteVehicleDto {
  @ApiProperty({
    description: 'ID of favorite vehicle',
    example: '6a0d296d-e93f-4a92-b7e6-6047fca6e361',
  })
  readonly id: string;

  @ApiProperty({
    description: 'ID of vehicle',
    example: '6a0d296d-e93f-4a92-b7e6-6047fca6e361',
  })
  readonly vehicleId: string;

  @ApiProperty({
    description: 'Status of notification',
    example: 'WAITING',
  })
  readonly deletedNotificationStatus: string;
}
