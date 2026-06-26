import { Injectable } from '@nestjs/common';
import { UserPermissionsRepository } from './user-permissions.repository';
import { UsersRepository } from 'modules/users';
import { CreateUserPermissionDto, UpdateUserPermissionDto } from './dto';
import { PagesRepository } from 'modules/pages';

@Injectable()
export class UserPermissionsService {
  constructor(
    private readonly userPermissionsRepository: UserPermissionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly pagesRepository: PagesRepository,
  ) {}
  async create(createUserPermissionDto: CreateUserPermissionDto) {
    const { user_id, page_id } = createUserPermissionDto;
    await this.usersRepository.findOneOrFail({ id: user_id });
    await this.pagesRepository.findOneOrFail({ id: page_id });
    return await this.userPermissionsRepository.create(createUserPermissionDto);
  }

  async findAll() {
    return await this.userPermissionsRepository.find();
  }

  async findOne(id: number) {
    return await this.userPermissionsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateUserPermissionDto: UpdateUserPermissionDto) {
    return await this.userPermissionsRepository.updateOneOrFail(
      { id },
      updateUserPermissionDto,
    );
  }

  async remove(id: number) {
    return await this.userPermissionsRepository.softDeleteOrFail({ id });
  }
}
