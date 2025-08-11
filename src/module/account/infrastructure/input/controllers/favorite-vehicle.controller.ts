import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
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
import { GetAllFavoriteVehiclesUseCase } from 'src/module/account/application/get-all-favorite-vehicles.use.case';
import { FavoriteVehicleDto } from '../dtos/response/favorite-vehicle.dto';

@ApiTags('account')
@Controller('account/favorite-vehicle')
export class FavoriteVehicleController {
  constructor(
    private readonly removeFavoriteVehicleUseCase: RemoveFavoriteVehicleUseCase,
    private readonly addFavoriteVehicleUseCase: AddFavoriteVehicleUseCase,
    private readonly getAllFavoriteVehiclesUseCase: GetAllFavoriteVehiclesUseCase,
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all favorite vehicles' })
  @ApiOkResponse({
    type: FavoriteVehicleDto,
  })
  @Get()
  async getAllFavoriteVehicles(
    @CurrentUser() user: SessionData,
  ): Promise<FavoriteVehicleDto[]> {
    return this.getAllFavoriteVehiclesUseCase.execute(user.accountId);
  }
}
