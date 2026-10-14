import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseItemsRepository, PurchasesRepository } from './repositories';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly purchasesRepository: PurchasesRepository,
    private readonly purchaseItemsRepository: PurchaseItemsRepository,
  ) {}
  async create(
    createPurchaseDto: CreatePurchaseDto,
    business_id: number,
    user_id: number,
  ) {
    // const {supplier_id, stock}=createPurchaseDto
    // const {stock}=createPurchaseDto.purchase_items
    return 'This action adds a new purchase';
  }

  findAll() {
    return `This action returns all purchases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
