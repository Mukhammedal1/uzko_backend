import { Injectable } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { ModulesRepository } from './modules.repository';
import { FilesRepository } from 'modules/files';

@Injectable()
export class ModulesService {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly filesRepository: FilesRepository,
  ) {}
  async create(createModuleDto: CreateModuleDto) {
    await this.filesRepository.findOneOrFail({
      id: createModuleDto.icon_file_id,
    });
    return await this.modulesRepository.create(createModuleDto);
  }

  async findAll() {
    return await this.modulesRepository.find({ relations: { icon: true } });
  }

  async findOne(id: number) {
    return await this.modulesRepository.findOneOrFail({ id });
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    if (updateModuleDto.icon_file_id !== undefined) {
      await this.filesRepository.findOneOrFail({
        id: updateModuleDto.icon_file_id,
      });
    }
    return await this.modulesRepository.updateOneOrFail(
      { id },
      updateModuleDto,
    );
  }

  async remove(id: number) {
    return await this.modulesRepository.softDeleteOrFail({ id });
  }
}
