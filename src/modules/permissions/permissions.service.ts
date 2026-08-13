import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { ModulesRepository } from 'modules/modules';
import { PagesRepository } from 'modules/pages';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly pagesRepository: PagesRepository,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    await this.modulesRepository.findOneOrFail({
      id: createPermissionDto.module_id,
    });
    await this.pagesRepository.findOneOrFail({
      id: createPermissionDto.page_id,
    });
    return await this.permissionsRepository.create(createPermissionDto);
  }

  async findAll() {
    return this.permissionsRepository.find();
  }

  async findOne(id: number) {
    return this.permissionsRepository.findOneOrFail({ id });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.modulesRepository.findOneOrFail({
      id: updatePermissionDto.module_id,
    });

    await this.pagesRepository.findOneOrFail({
      id: updatePermissionDto.page_id,
    });

    return this.permissionsRepository.updateOneOrFail(
      { id },
      updatePermissionDto,
    );
  }

  async remove(id: number) {
    return await this.permissionsRepository.softDeleteOrFail({ id });
  }
}
