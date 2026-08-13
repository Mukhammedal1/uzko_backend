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
import { ShelfNumbersService } from './shelf_numbers.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateShelfNumberDto, UpdateShelfNumberDto } from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Shelf Numbers')
@Controller({ version: '1', path: 'shelf-numbers' })
export class ShelfNumbersController {
  constructor(private readonly shelfNumbersService: ShelfNumbersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createShelfNumberDto: CreateShelfNumberDto,
    @BusinessId() business_id: number,
  ) {
    return this.shelfNumbersService.create(createShelfNumberDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@BusinessId() business_id: number) {
    return this.shelfNumbersService.findAll(+business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.shelfNumbersService.findOne(+id, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShelfNumberDto: UpdateShelfNumberDto,
    @BusinessId() business_id: number,
  ) {
    return this.shelfNumbersService.update(
      +id,
      updateShelfNumberDto,
      +business_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.shelfNumbersService.remove(+id, +business_id);
  }
}
