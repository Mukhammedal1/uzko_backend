import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserPermissionDto, UpdateUserPermissionDto } from './dto';

@ApiTags('User Permissions')
@Controller({ version: '1', path: 'user-permissions' })
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Post()
  create(@Body() createUserPermissionDto: CreateUserPermissionDto) {
    return this.userPermissionsService.create(createUserPermissionDto);
  }

  @Get()
  findAll() {
    return this.userPermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPermissionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPermissionDto: UpdateUserPermissionDto,
  ) {
    return this.userPermissionsService.update(+id, updateUserPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPermissionsService.remove(+id);
  }
}
