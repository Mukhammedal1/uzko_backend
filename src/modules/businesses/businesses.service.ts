import { Injectable } from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { BusinessesRepository } from './businesses.repository';

@Injectable()
export class BusinessesService {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async create(createBusinessDto: CreateBusinessDto) {
    return await this.businessesRepository.create(createBusinessDto);
  }

  async findAll() {
    return await this.businessesRepository.find();
  }

  async findOne(id: number) {
    return await this.businessesRepository.findOneOrFail({ id });
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return await this.businessesRepository.updateOneOrFail(
      { id },
      updateBusinessDto,
    );
  }

  async remove(id: number) {
    return await this.businessesRepository.softDeleteOrFail({ id });
  }
}
