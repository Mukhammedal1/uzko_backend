import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesRepository } from './sales.repository';
import { UsersRepository } from 'modules/users';
import { CustomersRepository } from 'modules/customers';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createSaleDto: CreateSaleDto) {
    const { user_id, customer_id, business_id } = createSaleDto;
    await this.usersRepository.findOneOrFail({ id: user_id });
    await this.customersRepository.findOneOrFail({ id: customer_id });
    await this.businessRepository.findOneOrFail({ id: business_id });

    return await this.salesRepository.create(createSaleDto);
  }

  async findAll() {
    return await this.salesRepository.find();
  }

  async findOne(id: number) {
    return await this.salesRepository.findOneOrFail({ id });
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    return await this.salesRepository.updateOneOrFail({ id }, updateSaleDto);
  }

  async remove(id: number) {
    return await this.salesRepository.softDeleteOrFail({ id });
  }
}
