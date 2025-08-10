import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  SessionData,
} from 'src/core/utils/decorators/current-user.decorator';
import { AddFavoriteVehicleUseCase } from 'src/module/account/application/add-favorite-vehicle.use-case';
import { RemoveFavoriteVehicleUseCase } from 'src/module/account/application/remove-favorite-vehicle.use-case';
import { AddFavoriteVehicleDto } from '../dtos/request/add-favorite-vehicle.dto';
import { AuthGuard } from 'src/module/auth/infrastructure/input/guards/auth.guard';

@ApiTags('account/favorite-vehicle')
@Controller('account/favorite-vehicle')
export class AccountController {
  constructor(
    private readonly removeFavoriteVehicleUseCase: RemoveFavoriteVehicleUseCase,
    private readonly addFavoriteVehicleUseCase: AddFavoriteVehicleUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new vehicle to favorite list' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async addFavoriteVehicle(
    @Body() addFavoriteVehicleDto: AddFavoriteVehicleDto,
    @CurrentUser() user: SessionData,
  ): Promise<void> {
    return this.addFavoriteVehicleUseCase.execute(
      user.accountId,
      addFavoriteVehicleDto.vehicleId,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove vehicle from favorite list' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':favoriteVehicleId')
  async removeFavoriteVehicle(
    @Param('favoriteVehicleId') favoriteVehicleId: string,
  ): Promise<void> {
    return this.removeFavoriteVehicleUseCase.execute(favoriteVehicleId);
  }
}
