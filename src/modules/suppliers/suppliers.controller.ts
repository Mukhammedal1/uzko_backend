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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Suppliers')
@Controller({ version: '1', path: 'suppliers' })
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @BusinessId() business_id: number,
  ) {
    return this.suppliersService.create(createSupplierDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@BusinessId() business_id: number) {
    return this.suppliersService.findAll(+business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.suppliersService.findOne(+id, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @BusinessId() business_id: number,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.suppliersService.remove(+id, +business_id);
  }
}
