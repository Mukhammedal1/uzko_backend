import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesRepository } from './pages.repository';
import { PagesEntity } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([PagesEntity])],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository],
  exports: [PagesService, PagesRepository],
})
export class PagesModule {}
