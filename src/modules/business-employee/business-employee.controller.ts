import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessEmployeeeService } from './business-employee.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBusinessEmployeeeDto, UpdateBusinessEmployeeeDto } from './dto';

@ApiTags('Business Employees')
@Controller('business-employee')
export class BusinessEmployeeeController {
  constructor(
    private readonly businessEmployeeeService: BusinessEmployeeeService,
  ) {}

  @Post()
  create(@Body() createBusinessEmployeeeDto: CreateBusinessEmployeeeDto) {
    return this.businessEmployeeeService.create(createBusinessEmployeeeDto);
  }

  @Get()
  findAll() {
    return this.businessEmployeeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessEmployeeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessEmployeeeDto: UpdateBusinessEmployeeeDto,
  ) {
    return this.businessEmployeeeService.update(
      +id,
      updateBusinessEmployeeeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessEmployeeeService.remove(+id);
  }
}
