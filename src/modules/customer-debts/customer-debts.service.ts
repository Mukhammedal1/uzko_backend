import { Injectable } from '@nestjs/common';
import { CustomerDebtsRepository } from './customer-debts.repository';
import { CreateCustomerDebtDto, UpdateCustomerDebtDto } from './dto';
import { CustomersRepository } from 'modules/customers';
import { SalesRepository } from 'modules/sales';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class CustomerDebtsService {
  constructor(
    private readonly customerDebtsRepository: CustomerDebtsRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly salesRepository: SalesRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createCustomerDebtDto: CreateCustomerDebtDto) {
    const { customer_id, sale_id, business_id } = createCustomerDebtDto;
    await Promise.all([
      await this.salesRepository.findOneOrFail({ id: sale_id }),
      await this.customersRepository.findOneOrFail({ id: customer_id }),
      await this.businessRepository.findOneOrFail({ id: business_id }),
    ]);
    return await this.customerDebtsRepository.create(createCustomerDebtDto);
  }

  async findAll() {
    return await this.customerDebtsRepository.find();
  }

  async findOne(id: number) {
    return await this.customerDebtsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateCustomerDebtDto: UpdateCustomerDebtDto) {
    return await this.customerDebtsRepository.updateOneOrFail(
      { id },
      updateCustomerDebtDto,
    );
  }

  async remove(id: number) {
    return await this.customerDebtsRepository.softDeleteOrFail({ id });
  }
}
