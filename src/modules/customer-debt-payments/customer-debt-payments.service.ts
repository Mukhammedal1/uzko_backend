import { Injectable } from '@nestjs/common';
import { CustomerDebtPaymentsRepository } from './customer-debt-payments.repository';
import {
  CreateCustomerDebtPaymentDto,
  UpdateCustomerDebtPaymentDto,
} from './dto';
import { CustomersRepository } from 'modules/customers';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class CustomerDebtPaymentsService {
  constructor(
    private readonly customerDebtPaymentsRepository: CustomerDebtPaymentsRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly businessesRepository: BusinessesRepository,
  ) {}
  async create(createCustomerDebtPaymentDto: CreateCustomerDebtPaymentDto) {
    const { customer_id, business_id, ...data } = createCustomerDebtPaymentDto;
    await this.customersRepository.findOneOrFail({ id: customer_id });
    await this.businessesRepository.findOneOrFail({ id: business_id });
    return await this.customerDebtPaymentsRepository.create(
      createCustomerDebtPaymentDto,
    );
  }

  async findAll() {
    return await this.customerDebtPaymentsRepository.find();
  }

  async findOne(id: number) {
    return await this.customerDebtPaymentsRepository.findOneOrFail({ id });
  }

  async update(
    id: number,
    updateCustomerDebtPaymentDto: UpdateCustomerDebtPaymentDto,
  ) {
    return await this.customerDebtPaymentsRepository.updateOneOrFail(
      { id },
      updateCustomerDebtPaymentDto,
    );
  }

  async remove(id: number) {
    return await this.customerDebtPaymentsRepository.softDeleteOrFail({ id });
  }
}
