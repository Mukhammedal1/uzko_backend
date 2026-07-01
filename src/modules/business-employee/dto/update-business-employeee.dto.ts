import { PartialType } from '@nestjs/swagger';
import { CreateBusinessEmployeeeDto } from './create-business-employeee.dto';

export class UpdateBusinessEmployeeeDto extends PartialType(CreateBusinessEmployeeeDto) {}
