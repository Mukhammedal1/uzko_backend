import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BulkDeleteDto,
  BulkUpdateProductsDto,
  BulkUpdateVariantsDto,
  CreateProductsDto,
  CreateVariantDto,
  ProductFilterDto,
} from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ version: '1', path: 'products' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() createProductsDto: CreateProductsDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.create(createProductsDto, +business_id);
  }

  @Get()
  findAll(@Query() dto: ProductFilterDto, @BusinessId() business_id: number) {
    return this.productsService.findAll(dto, business_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.productsService.findOne(+id, +business_id);
  }

  @Post(':id/variants')
  createVariant(
    @Param('id') id: number,
    @Body() dto: CreateVariantDto,
    @BusinessId('business_id') business_id: number,
  ) {
    return this.productsService.createVariant(id, dto, business_id);
  }

  @Patch()
  bulkUpdateProducts(
    @Body() dto: BulkUpdateProductsDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.bulkUpdateProducts(dto.products, +business_id);
  }

  @Patch('variants')
  bulkUpdateVariants(
    @Body() dto: BulkUpdateVariantsDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.bulkUpdateVariants(dto.items, +business_id);
  }

  @Delete()
  bulkRemove(@Body() dto: BulkDeleteDto, @BusinessId() business_id: number) {
    return this.productsService.bulkRemove(dto, +business_id);
  }
}
