import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { BusinessesRepository } from 'modules/businesses';
import { CreateProductsDto, UpdateProductDto } from './dto';
import { CurrencyRepository } from 'modules/currency';
import {
  BusinessesEntity,
  CurrencyEntity,
  ProductBarcodesEntity,
  ProductsEntity,
  ShelfNumbersEntity,
  StocksEntity,
  UnitsEntity,
} from '@database';
import { EntityManager, EntityTarget, In } from 'typeorm';
import { CREATE_PRODUCT_CHUNK } from '@constants';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  private chunk<T>(arr: T[]): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += CREATE_PRODUCT_CHUNK)
      out.push(arr.slice(i, i + CREATE_PRODUCT_CHUNK));
    return out;
  }

  private async check(
    manager: EntityManager,
    entity: EntityTarget<any>,
    ids: Set<number>,
    where: object,
    label: string,
  ) {
    if (!ids.size) return;

    const found = await manager.count(entity, {
      where: { id: In([...ids]), ...where },
    });

    if (found !== ids.size) {
      throw new NotFoundException(
        `${label} topilmadi yoki sizga tegishli emas`,
      );
    }
  }

  async create(createProductsDto: CreateProductsDto, business_id: number) {
    const { products: items, is_purchase } = createProductsDto;

    if (is_purchase) {
      return 'purchase create boldi';
    }

    const currencies = new Set<number>();
    const units = new Set<number>();
    const stocks = new Set<number>();
    const shelves = new Set<number>();
    const codes = new Map<string, number>();

    items.forEach((item, i) => {
      [
        item.purchase_price_currency_id,
        item.retail_price_currency_id,
        item.wholesale_price_currency_id,
      ].forEach((id) => id && currencies.add(id));

      units.add(item.unit_id);
      stocks.add(item.stock_id);
      if (item.shelf_number_id) shelves.add(item.shelf_number_id);

      item.barcodes.forEach((code) => codes.set(code, i));
    });

    return this.productsRepository.withTransaction(async (manager) => {
      await this.check(manager, CurrencyEntity, currencies, {}, 'Valyuta');
      await this.check(manager, UnitsEntity, units, {}, "O'lchov birligi");
      await this.check(manager, StocksEntity, stocks, { business_id }, 'Ombor');
      await this.check(
        manager,
        ShelfNumbersEntity,
        shelves,
        { business_id },
        'Javon',
      );

      const busy = await manager.find(ProductBarcodesEntity, {
        where: { code: In([...codes.keys()]), product: { business_id } },
        select: { code: true },
      });

      if (busy.length) {
        throw new ConflictException(
          `Shtrix kod band: ${busy.map((b) => b.code).join(', ')}`,
        );
      }

      const rows = items.map(({ barcodes, ...rest }) => ({
        ...rest,
        business_id,
        allow_below_cost_sale: rest.allow_below_cost_sale ?? false,
        shelf_number_id: rest.shelf_number_id ?? null,
        wholesale_price: rest.wholesale_price ?? null,
        wholesale_price_currency_id: rest.wholesale_price_currency_id ?? null,
        retail_price_percentage: rest.retail_price_percentage ?? null,
        wholesale_price_percentage: rest.wholesale_price_percentage ?? null,
      }));

      const ids: number[] = [];
      for (const part of this.chunk(rows)) {
        const res = await manager.insert(ProductsEntity, part);
        ids.push(...res.identifiers.map((r) => r.id as number));
      }

      const barcodeRows = [...codes].map(([code, i]) => ({
        code,
        product_id: ids[i],
      }));

      for (const part of this.chunk(barcodeRows)) {
        await manager.insert(ProductBarcodesEntity, part);
      }

      return { products: ids.length, barcodes: barcodeRows.length };
    });
  }

  async findAll() {
    return await this.productsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
