import { Injectable } from '@nestjs/common';
import { CreateShelfNumberDto, UpdateShelfNumberDto } from './dto';
import { ShelfNumbersRepository } from './shelf_numbers.repository';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class ShelfNumbersService {
  constructor(
    private readonly shlefNumbersRepository: ShelfNumbersRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(
    createShelfNumberDto: CreateShelfNumberDto,
    business_id: number,
  ) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });
    return await this.shlefNumbersRepository.create(createShelfNumberDto);
  }

  async findAll(business_id: number) {
    return await this.shlefNumbersRepository.find({
      where: { business_id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, business_id: number) {
    return await this.shlefNumbersRepository.findOneOrFail({ id, business_id });
  }

  async update(
    id: number,
    updateShelfNumberDto: UpdateShelfNumberDto,
    business_id: number,
  ) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });
    return await this.shlefNumbersRepository.updateOneOrFail(
      { id, business_id: business_id },
      updateShelfNumberDto,
    );
  }

  async remove(id: number, business_id: number) {
    return await this.shlefNumbersRepository.softDeleteOrFail({
      id,
      business_id,
    });
  }
}
