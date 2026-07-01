import { Injectable } from '@nestjs/common';
import { CreateBusinessEmployeeeDto, UpdateBusinessEmployeeeDto } from './dto';
import { BusinessEmployeesRepository } from './business-employee.repository';
import { UsersRepository } from 'modules/users';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class BusinessEmployeeeService {
  constructor(
    private readonly businessEmployeeRepository: BusinessEmployeesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createBusinessEmployeeeDto: CreateBusinessEmployeeeDto) {
    await this.businessRepository.findOneOrFail({
      id: createBusinessEmployeeeDto.business_id,
    });

    await this.usersRepository.findOneOrFail({
      id: createBusinessEmployeeeDto.user_id,
    });
    return await this.businessEmployeeRepository.create(
      createBusinessEmployeeeDto,
    );
  }

  async findAll() {
    return await this.businessEmployeeRepository.find();
  }

  async findOne(id: number) {
    return await this.businessEmployeeRepository.findOneOrFail({ id });
  }

  async update(
    id: number,
    updateBusinessEmployeeeDto: UpdateBusinessEmployeeeDto,
  ) {
    return await this.businessEmployeeRepository.updateOneOrFail(
      { id },
      updateBusinessEmployeeeDto,
    );
  }

  async remove(id: number) {
    return await this.businessEmployeeRepository.softDeleteOrFail({ id });
  }
}
