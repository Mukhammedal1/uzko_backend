import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BusinessCurrencyService } from './business-currency.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BusinessId, JwtAuthGuard } from '@common';
import { UpdateBusinessCurrencyDto } from './dto';

@ApiTags('Business Currency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'business-currency' })
export class BusinessCurrencyController {
  constructor(
    private readonly businessCurrencyService: BusinessCurrencyService,
  ) {}

  @Post()
  upsert(
    @Body() updateBusinessCurrencyDto: UpdateBusinessCurrencyDto,
    @BusinessId() business_id: number,
  ) {
    return this.businessCurrencyService.upsert(
      updateBusinessCurrencyDto,
      +business_id,
    );
  }

  @Get()
  findAll(@BusinessId() business_id: number) {
    return this.businessCurrencyService.findAll(+business_id);
  }

  @Patch(':currency_id/main')
  setMain(
    @Param('currency_id') currency_id: number,
    @BusinessId() business_id: number,
  ) {
    return this.businessCurrencyService.setMain(currency_id, business_id);
  }
}
