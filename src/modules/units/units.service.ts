import { Injectable } from '@nestjs/common';
import { CreateUnitDto, UpdateUnitDto } from './dto';
import { UnitsRepository } from './units.repository';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class UnitsService {
  constructor(
    private readonly unitsRepository: UnitsRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createUnitDto: CreateUnitDto) {
    await this.businessRepository.findOneOrFail({
      id: createUnitDto.business_id,
    });
    return await this.unitsRepository.create(createUnitDto);
  }

  async findAll() {
    return await this.unitsRepository.find();
  }

  async findOne(id: number) {
    return await this.unitsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    await this.businessRepository.findOneOrFail({
      id: updateUnitDto.business_id,
    });
    return await this.unitsRepository.updateOneOrFail(
      { id, business_id: updateUnitDto.business_id },
      updateUnitDto,
    );
  }

  async remove(id: number) {
    return await this.unitsRepository.softDeleteOrFail({ id });
  }
}
