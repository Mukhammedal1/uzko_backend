import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDebtDto } from './create-customer-debt.dto';

export class UpdateCustomerDebtDto extends PartialType(CreateCustomerDebtDto) {}
