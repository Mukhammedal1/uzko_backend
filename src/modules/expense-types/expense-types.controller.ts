import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpenseTypesService } from './expense-types.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateExpenseTypeDto, UpdateExpenseTypeDto } from './dto';
import { BusinessId, JwtAuthGuard } from '@common';

@ApiTags('Expense Category')
@Controller({ version: '1', path: 'expense-types' })
export class ExpenseTypesController {
  constructor(private readonly expenseTypesService: ExpenseTypesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createExpenseTypeDto: CreateExpenseTypeDto,
    @BusinessId() business_id: number,
  ) {
    return this.expenseTypesService.create(createExpenseTypeDto, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@BusinessId() business_id: number) {
    return this.expenseTypesService.findAll(+business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.expenseTypesService.findOne(+id, +business_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
    @BusinessId() business_id: number,
  ) {
    return this.expenseTypesService.update(
      +id,
      updateExpenseTypeDto,
      +business_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @BusinessId() business_id: number) {
    return this.expenseTypesService.remove(+id, +business_id);
  }
}
