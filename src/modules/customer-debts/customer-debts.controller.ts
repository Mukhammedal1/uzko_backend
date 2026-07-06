import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerDebtsService } from './customer-debts.service';
import { CreateCustomerDebtDto, UpdateCustomerDebtDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer Debts')
@Controller({ version: '1', path: 'customer-debts' })
export class CustomerDebtsController {
  constructor(private readonly customerDebtsService: CustomerDebtsService) {}

  @Post()
  create(@Body() createCustomerDebtDto: CreateCustomerDebtDto) {
    return this.customerDebtsService.create(createCustomerDebtDto);
  }

  @Get()
  findAll() {
    return this.customerDebtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerDebtsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDebtDto: UpdateCustomerDebtDto,
  ) {
    return this.customerDebtsService.update(+id, updateCustomerDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerDebtsService.remove(+id);
  }
}
