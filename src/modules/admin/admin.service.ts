import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { UsersRepository } from 'modules/users';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminsRepository: AdminRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const { user_id } = createAdminDto;
    await this.usersRepository.findOneOrFail({ id: user_id });
    return await this.adminsRepository.create(createAdminDto);
  }

  async findAll() {
    return await this.adminsRepository.find();
  }

  async findOne(id: number) {
    return await this.adminsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return await this.adminsRepository.updateOneOrFail({ id }, updateAdminDto);
  }

  async remove(id: number) {
    return await this.adminsRepository.softDeleteOrFail({ id });
  }
}
