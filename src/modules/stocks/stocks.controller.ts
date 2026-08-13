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
import { StocksService } from './stocks.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStockDto, UpdateStockDto } from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Stocks')
@Controller({ version: '1', path: 'stocks' })
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @BusinessId() business_id: number,
    @Body() createStockDto: CreateStockDto,
  ) {
    return this.stocksService.create(createStockDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@BusinessId() business_id: number) {
    return this.stocksService.findAll(+business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.stocksService.findOne(+id, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @BusinessId() business_id: number,
  ) {
    return this.stocksService.update(+id, updateStockDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.stocksService.remove(+id, +business_id);
  }
}
