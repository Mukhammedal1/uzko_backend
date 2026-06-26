import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto';
import { BusinessesService } from 'modules/businesses';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly businessService: BusinessesService,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const { business_id, ...data } = createCurrencyDto;
    await this.businessService.findOne(business_id);
    return await this.currencyRepository.create({ business_id, ...data });
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
    if (updateCurrencyDto.business_id !== undefined) {
      await this.businessService.findOne(updateCurrencyDto.business_id);
    }
    return await this.currencyRepository.updateOneOrFail(
      { id },
      updateCurrencyDto,
    );
  }

  async remove(id: number) {
    return await this.currencyRepository.softDeleteOrFail({ id });
  }
}
