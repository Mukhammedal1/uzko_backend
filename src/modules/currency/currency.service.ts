import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto';
import { BusinessCurrencyRepository } from 'modules/business-currency';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    return await this.currencyRepository.create(createCurrencyDto);
  }

  async findAll() {
    return await this.currencyRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    return await this.currencyRepository.findOneOrFail({ id });
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return await this.currencyRepository.updateOneOrFail(
      { id },
      updateCurrencyDto,
    );
  }

  async remove(id: number) {
    return await this.currencyRepository.softDeleteOrFail({ id });
  }
}
