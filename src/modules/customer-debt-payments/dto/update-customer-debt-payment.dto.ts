import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDebtPaymentDto } from './create-customer-debt-payment.dto';

export class UpdateCustomerDebtPaymentDto extends PartialType(CreateCustomerDebtPaymentDto) {}
