import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Businesses')
@Controller({ version: '1', path: 'businesses' })
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessesService.remove(+id);
  }

}
