import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessCurrencyRepository } from './business-currency.repository';
import { BusinessesRepository } from 'modules/businesses';
import { CurrencyRepository } from 'modules/currency';
import { UpdateBusinessCurrencyDto } from './dto';
import { BusinessCurrencyEntity } from '@database';

@Injectable()
export class BusinessCurrencyService {
  constructor(
    private readonly businessCurrencyRepository: BusinessCurrencyRepository,
    private readonly businessesRepository: BusinessesRepository,
    private readonly currencyRepository: CurrencyRepository,
  ) {}
  async upsert(
    createBusinessCurrencyDto: UpdateBusinessCurrencyDto,
    business_id: number,
  ) {
    const { currency_id, rate } = createBusinessCurrencyDto;
    await this.businessesRepository.findOneOrFail({ id: business_id });
    const currency = await this.currencyRepository.findOneOrFail({
      id: createBusinessCurrencyDto.currency_id,
    });
    if (currency.name === 'UZS') {
      throw new ForbiddenException('Permission denied');
    }
    return await this.businessCurrencyRepository.upsert(
      {
        currency_id,
        business_id,
        rate: String(rate),
      },
      ['business_id', 'currency_id'],
    );
  }

  async findAll(business_id: number) {
    const business_currency = await this.businessCurrencyRepository.find({
      where: { business_id },
      order: { id: "ASC" },
      relations: { currency: true },
      select: {
        id: true,
        currency_id: true,
        business_id: true,
        rate: true,
        is_main: true,
        currency: { name: true, symbol: true },
      },
    });
    return business_currency.map((row) => ({
      id: row.id,
      currency_id: row.currency_id,
      name: row.currency.name,
      symbol: row.currency.symbol,
      rate: Number(row.rate),
      is_main: row.is_main,
    }));
  }

  async setMain(currency_id: number, business_id: number) {
    return this.businessCurrencyRepository.withTransaction(async (manager) => {
      const row = await manager.findOneBy(BusinessCurrencyEntity, {
        business_id,
        currency_id,
      });

      if (!row) throw new NotFoundException('Valyuta topilmadi');

      // Avvalgi asosiy valyuta bekor qilinadi
      await manager.update(
        BusinessCurrencyEntity,
        { business_id, is_main: true },
        { is_main: false },
      );

      await manager.update(
        BusinessCurrencyEntity,
        { id: row.id },
        { is_main: true },
      );

      return { success: true };
    });
  }
}
