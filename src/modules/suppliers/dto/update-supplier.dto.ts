import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
