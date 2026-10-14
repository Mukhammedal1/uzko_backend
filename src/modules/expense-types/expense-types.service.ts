import { Injectable } from '@nestjs/common';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { ExpenseTypesRepository } from './expense-types.repository';

@Injectable()
export class ExpenseTypesService {
  constructor(
    private readonly expenseTypesRepository: ExpenseTypesRepository,
  ) {}
  async create(
    createExpenseTypeDto: CreateExpenseTypeDto,
    business_id: number,
  ) {
    return await this.expenseTypesRepository.create({
      ...createExpenseTypeDto,
      business_id,
    });
  }

  async findAll(business_id: number) {
    return await this.expenseTypesRepository.find({
      where: { business_id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, business_id: number) {
    return await this.expenseTypesRepository.findOneOrFail({ id, business_id });
  }

  async update(
    id: number,
    updateExpenseTypeDto: UpdateExpenseTypeDto,
    business_id: number,
  ) {
    return await this.expenseTypesRepository.updateOneOrFail(
      {
        id,
        business_id,
      },
      updateExpenseTypeDto,
    );
  }

  async remove(id: number, business_id: number) {
    return await this.expenseTypesRepository.softDeleteOrFail({
      id,
      business_id,
    });
  }
}
