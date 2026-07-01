import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBusinessEmployeeDto } from './dto';

@ApiTags('Users')
@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createBusinessEmployeeDto: CreateBusinessEmployeeDto) {
    return this.usersService.create(createBusinessEmployeeDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
