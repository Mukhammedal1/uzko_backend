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
import { UnitsService } from './units.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Units')
@Controller({ version: '1', path: 'units' })
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(+id);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(+id, updateUnitDto);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(+id);
  }
}
