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
  CreateProductsDto,
  CreateVariantDto,
  ProductFilterDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Products')
@Controller({ version: '1', path: 'products' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductsDto: CreateProductsDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.create(createProductsDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() dto: ProductFilterDto, @BusinessId() business_id: number) {
    return this.productsService.findAll(dto, business_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/variants')
  createVariant(
    @Param('id') id: number,
    @Body() dto: CreateVariantDto,
    @BusinessId('business_id') business_id: number,
  ) {
    return this.productsService.createVariant(id, dto, business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.update(+id, updateProductDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/variants/:id')
  productVariantUpdate(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.updateProductVariant(
      +id,
      updateProductVariantDto,
      +business_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.productsService.remove(+id, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/variants/:id')
  productVariantDelete(
    @Param('id') id: string,
    @BusinessId() business_id: number,
  ) {
    return this.productsService.productVariantDelete(+id, +business_id);
  }
}
