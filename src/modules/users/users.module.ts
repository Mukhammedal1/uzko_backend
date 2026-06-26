import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@database';
import { BusinessesModule } from 'modules/businesses';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), BusinessesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
