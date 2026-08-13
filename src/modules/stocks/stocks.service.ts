import { Injectable } from '@nestjs/common';
import { StocksRepository } from './stocks.repository';
import { CreateStockDto, UpdateStockDto } from './dto';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class StocksService {
  constructor(
    private readonly stocksRepository: StocksRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createStockDto: CreateStockDto, business_id: number) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });
    return await this.stocksRepository.create({
      ...createStockDto,
      business_id,
    });
  }

  async findAll(business_id: number) {
    return await this.stocksRepository.find({
      where: { business_id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, business_id: number) {
    return await this.stocksRepository.findOneOrFail({ id, business_id });
  }

  async update(
    id: number,
    updateStockDto: UpdateStockDto,
    business_id: number,
  ) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });
    return await this.stocksRepository.updateOneOrFail(
      { id, business_id },
      updateStockDto,
    );
  }

  async remove(id: number, business_id: number) {
    return await this.stocksRepository.softDeleteOrFail({ id, business_id });
  }
}
