import { Injectable } from '@nestjs/common';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import { UnitsRepository } from './units.repository';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class UnitsService {
  constructor(private readonly unitsRepository: UnitsRepository) {}
  async create(createUnitDto: CreateUnitDto) {
    return await this.unitsRepository.create(createUnitDto);
  }

  async findAll() {
    return await this.unitsRepository.find({
      order: { created_at: "ASC" },
    });
  }

  async findOne(id: number) {
    return await this.unitsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    return await this.unitsRepository.updateOneOrFail({ id }, updateUnitDto);
  }

  async remove(id: number) {
    return await this.unitsRepository.softDeleteOrFail({ id });
  }
}
