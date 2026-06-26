import { Injectable } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { BusinessesService } from 'modules/businesses';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly businessService: BusinessesService,
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const { business_id, ...data } = createCustomerDto;
    await this.businessService.findOne(business_id);
    return await this.customersRepository.create({ business_id, ...data });
  }

  async findAll() {
    return await this.customersRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    return await this.customersRepository.findOneOrFail({ id });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    if (updateCustomerDto.business_id !== undefined) {
      await this.businessService.findOne(updateCustomerDto.business_id);
    }
    return await this.customersRepository.updateOneOrFail(
      { id },
      updateCustomerDto,
    );
  }

  async remove(id: number) {
    return await this.customersRepository.softDeleteOrFail({ id });
  }
}
