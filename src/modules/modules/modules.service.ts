import { Injectable } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { ModulesRepository } from './modules.repository';

@Injectable()
export class ModulesService {
  constructor(private readonly modulesRepository: ModulesRepository) {}
  async create(createModuleDto: CreateModuleDto) {
    return await this.modulesRepository.create(createModuleDto);
  }

  async findAll() {
    return await this.modulesRepository.find();
  }

  async findOne(id: number) {
    return await this.modulesRepository.findOneOrFail({ id });
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    return await this.modulesRepository.updateOneOrFail(
      { id },
      updateModuleDto,
    );
  }

  async remove(id: number) {
    return await this.modulesRepository.softDeleteOrFail({ id });
  }
}
