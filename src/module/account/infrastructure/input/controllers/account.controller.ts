import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  SessionData,
} from 'src/core/utils/decorators/current-user.decorator';
import { AuthGuard } from 'src/module/auth/infrastructure/input/guards/auth.guard';
import { FavoriteVehicleDto } from '../dtos/response/favorite-vehicle.dto';
import { GetAccountInformationUseCase } from 'src/module/account/application/get-account-information.use-case';
import { AccountDto } from '../dtos/response/account.dto';
import { UpdateAccountUseCase } from 'src/module/account/application/update-account.use-case';
import { UpdateAccountDto } from '../dtos/request/update-account.dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly getAccountInformationUseCase: GetAccountInformationUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Account information' })
  @ApiOkResponse({
    type: AccountDto,
  })
  @Get()
  async getAccountInformation(
    @CurrentUser() user: SessionData,
  ): Promise<AccountDto> {
    return this.getAccountInformationUseCase.execute(user.accountId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set flag to enable or disable notifications' })
  @ApiOkResponse({
    type: AccountDto,
  })
  @Patch()
  async updateAccount(
    @Body() body: UpdateAccountDto,
    @CurrentUser() user: SessionData,
  ): Promise<AccountDto> {
    console.log(body)
    return this.updateAccountUseCase.execute(
      user.accountId,
      body.hasActiveNotifications as boolean,
    );
  }
}
