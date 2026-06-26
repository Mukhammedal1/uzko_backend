import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { BusinessesService } from 'modules/businesses';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly businessService: BusinessesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { business_id, ...data } = createUserDto;
    await this.businessService.findOne(business_id);
    return await this.usersRepository.create({ business_id, ...data });
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneOrFail({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.business_id !== undefined) {
      await this.businessService.findOne(updateUserDto.business_id);
    }
    return await this.usersRepository.updateOneOrFail({ id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.softDeleteOrFail({ id });
  }
}
