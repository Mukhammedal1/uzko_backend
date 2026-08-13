import { Injectable } from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { SuppliersRepository } from './suppliers.repository';
import { BusinessesRepository } from 'modules/businesses';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly suppliersRepository: SuppliersRepository,
    private readonly businessRepository: BusinessesRepository,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    await this.businessRepository.findOneOrFail({
      id: createSupplierDto.business_id,
    });
    return await this.suppliersRepository.create(createSupplierDto);
  }

  async findAll() {
    return await this.suppliersRepository.find();
  }

  async findOne(id: number) {
    return await this.suppliersRepository.findOneOrFail({ id });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    await this.findOne(id);

    await this.businessRepository.findOneOrFail({
      id: updateSupplierDto.business_id,
    });

    return await this.suppliersRepository.updateOneOrFail(
      { id },
      updateSupplierDto,
    );
  }

  async remove(id: number) {
    return await this.suppliersRepository.softDeleteOrFail({ id });
  }
}
