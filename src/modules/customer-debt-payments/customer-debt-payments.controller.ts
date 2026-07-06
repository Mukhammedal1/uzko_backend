import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerDebtPaymentsService } from './customer-debt-payments.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateCustomerDebtPaymentDto,
  UpdateCustomerDebtPaymentDto,
} from './dto';

@ApiTags('Custmer Debt Payments')
@Controller({ version: '1', path: 'customer-debt-payments' })
export class CustomerDebtPaymentsController {
  constructor(
    private readonly customerDebtPaymentsService: CustomerDebtPaymentsService,
  ) {}

  @Post()
  create(@Body() createCustomerDebtPaymentDto: CreateCustomerDebtPaymentDto) {
    return this.customerDebtPaymentsService.create(
      createCustomerDebtPaymentDto,
    );
  }

  @Get()
  findAll() {
    return this.customerDebtPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerDebtPaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDebtPaymentDto: UpdateCustomerDebtPaymentDto,
  ) {
    return this.customerDebtPaymentsService.update(
      +id,
      updateCustomerDebtPaymentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerDebtPaymentsService.remove(+id);
  }
}
