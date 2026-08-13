import { PartialType } from '@nestjs/swagger';
import { CreateShelfNumberDto } from './create-shelf_number.dto';

export class UpdateShelfNumberDto extends PartialType(CreateShelfNumberDto) {}
