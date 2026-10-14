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
  async create(createSupplierDto: CreateSupplierDto, business_id: number) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });
    return await this.suppliersRepository.create({
      ...createSupplierDto,
      business_id,
    });
  }

  async findAll(business_id: number) {
    return await this.suppliersRepository.find({
      where: { business_id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, business_id: number) {
    return await this.suppliersRepository.findOneOrFail({ id, business_id });
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
    business_id: number,
  ) {
    await this.businessRepository.findOneOrFail({
      id: business_id,
    });

    return await this.suppliersRepository.updateOneOrFail(
      { id },
      updateSupplierDto,
    );
  }

  async remove(id: number, business_id: number) {
    return await this.suppliersRepository.softDeleteOrFail({ id, business_id });
  }
}
