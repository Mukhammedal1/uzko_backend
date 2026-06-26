import { Injectable } from '@nestjs/common';
import { PagesRepository } from './pages.repository';
import { CreatePageDto, UpdatePageDto } from './dto';

@Injectable()
export class PagesService {
  constructor(private readonly pagesRepository: PagesRepository) {}
  async create(createPageDto: CreatePageDto) {
    return await this.pagesRepository.create(createPageDto);
  }

  async findAll() {
    return await this.pagesRepository.find();
  }

  async findOne(id: number) {
    return await this.pagesRepository.findOneOrFail({ id });
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    return await this.pagesRepository.updateOneOrFail({ id }, updatePageDto);
  }

  async remove(id: number) {
    return await this.pagesRepository.softDeleteOrFail({ id });
  }
}
