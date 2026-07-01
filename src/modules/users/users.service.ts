import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { BusinessesService } from 'modules/businesses';
import { BusinessEmployeesEntity, UserPermissionsEntity, UsersEntity } from '@database';
import * as bcrypt from 'bcrypt';
import { USER_TYPE } from '@enums';
import { CreateBusinessEmployeeDto } from './dto';
import { PagesRepository, PagesService } from 'modules/pages';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly businessService: BusinessesService,
    private readonly pagesRepository: PagesRepository,
  ) {}
  async create(createBusinessEmployeeDto: CreateBusinessEmployeeDto) {
    const { business_id, email, page_ids, ...data } = createBusinessEmployeeDto;
    await this.businessService.findOne(business_id);
    const existedUser = await this.usersRepository.findOne({ email });
    if (existedUser) {
      throw new BadRequestException('user already exists');
    }

    const pages = await this.pagesRepository.find({
      where: { id: In(page_ids) },
    });

    if (pages.length !== page_ids.length) {
      throw new NotFoundException('One or more permissions not found');
    }
    const hashedPassword = await bcrypt.hash(data.password, 7);
    const user = await this.usersRepository.withTransaction(async (manager) => {
      const user = await manager.save(UsersEntity, {
        email: email,
        hashed_password: hashedPassword,
        user_type: USER_TYPE.BUSINESS_USER,
        business_id: business_id,
      });

      const business_employee = await manager.save(BusinessEmployeesEntity, {
        first_name: data.first_name,
        last_name: data.last_name ?? null,
        business_id: business_id,
        user_id: user.id,
      });

      const user_permissions = await manager.save(
        UserPermissionsEntity,
        pages.map((page) => ({
          user_id: user.id,
          page_id: page.id,
        })),
      );

      return user;
    });
    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneOrFail({ id });
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   if (updateUserDto.business_id !== undefined) {
  //     await this.businessService.findOne(updateUserDto.business_id);
  //   }
  //   return await this.usersRepository.updateOneOrFail({ id }, updateUserDto);
  // }

  async remove(id: number) {
    return await this.usersRepository.softDeleteOrFail({ id });
  }
}
