import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import {
  CreateProductsDto,
  CreateVariantDto,
  ProductFilterDto,
  UpdateProductDto,
  UpdateProductVariantDto,
} from './dto';
import {
  CurrencyEntity,
  FilesEntity,
  ProductsEntity,
  ProductVariantBarcodesEntity,
  ProductVariantsEntity,
  ShelfNumbersEntity,
  StocksEntity,
  UnitsEntity,
} from '@database';
import { EntityManager, EntityTarget, In } from 'typeorm';
import { CREATE_PRODUCT_CHUNK } from '@constants';
import { generateBarcode } from 'utils/helpers/generate-barcode';
import { generateArtikul } from 'utils/helpers/generate-artikul';
import { ProductVariantsRepository } from './repositories';
import { UnitsRepository } from 'modules/units';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productVariantsRepository: ProductVariantsRepository,
    private readonly unitsRepository: UnitsRepository,
  ) {}

  private chunk<T>(arr: T[], size = CREATE_PRODUCT_CHUNK): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
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

  // YANGI: bazada ham, so'rov ichida ham band bo'lmagan kodlar
  private async generateBarcodes(
    manager: EntityManager,
    business_id: number,
    count: number,
    taken: Set<string>,
  ): Promise<string[]> {
    const result: string[] = [];

    while (result.length < count) {
      const batch = new Set<string>();
      while (batch.size < count - result.length) {
        const code = generateBarcode();
        if (!taken.has(code)) batch.add(code);
      }

      const busy = new Set<string>();
      for (const part of this.chunk([...batch])) {
        const rows = await manager.find(ProductVariantBarcodesEntity, {
          where: { business_id, barcode: In(part) },
          select: { barcode: true },
        });
        rows.forEach((r) => busy.add(r.barcode));
      }

      for (const code of batch) {
        if (busy.has(code)) continue;
        result.push(code);
        taken.add(code);
      }
    }

    return result;
  }

  // Kelgan ro'yxat — variantning to'liq yangi ro'yxati.
  // Ro'yxatda yo'q kodlar o'chiriladi, yangilari qo'shiladi.
  private async syncBarcodes(
    manager: EntityManager,
    variant_id: number,
    business_id: number,
    codes: string[],
  ) {
    const current = await manager.find(ProductVariantBarcodesEntity, {
      where: { product_variant_id: variant_id },
      select: { id: true, barcode: true },
    });

    const currentCodes = current.map((c) => c.barcode);
    const toAdd = codes.filter((c) => !currentCodes.includes(c));
    const toRemove = current.filter((c) => !codes.includes(c.barcode));

    if (toAdd.length) {
      // Yangi kodlar biznesda band emasligini tekshiramiz
      const busy = await manager.find(ProductVariantBarcodesEntity, {
        where: { business_id, barcode: In(toAdd) },
        select: { barcode: true },
      });

      if (busy.length) {
        throw new ConflictException(
          `Shtrix kod band: ${busy.map((b) => b.barcode).join(', ')}`,
        );
      }

      await manager.insert(
        ProductVariantBarcodesEntity,
        toAdd.map((barcode) => ({
          barcode,
          business_id,
          product_variant_id: variant_id,
        })),
      );
    }

    if (toRemove.length) {
      await manager.softDelete(
        ProductVariantBarcodesEntity,
        toRemove.map((c) => c.id),
      );
    }
  }

  async create(createProductsDto: CreateProductsDto, business_id: number) {
    const { products } = createProductsDto;

    const currencies = new Set<number>();
    const units = new Set<number>();
    const files = new Set<number>();
    const codes = new Set<string>();
    const dupCodes = new Set<string>();

    for (const product of products) {
      units.add(product.unit_id);
      if (!product.name && product.variants.length > 1) {
        throw new BadRequestException('Variantli mahsulot uchun nom majburiy');
      }
      const artikuls = new Set<string>();

      for (const v of product.variants) {
        // YANGI: faqat kiritilgan artikul tekshiriladi
        if (v.artikul) {
          if (artikuls.has(v.artikul)) {
            throw new BadRequestException(
              `"${product.name ?? product.variants[0].name}" mahsulotida artikul takrorlangan: ${v.artikul}`,
            );
          }
          artikuls.add(v.artikul);
        }

        [
          v.purchase_price_currency_id,
          v.retail_price_currency_id,
          v.wholesale_price_currency_id,
        ].forEach((id) => id && currencies.add(id));

        if (v.file_id) files.add(v.file_id);
        for (const code of v.barcodes ?? []) {
          if (codes.has(code)) dupCodes.add(code);
          codes.add(code);
        }
      }
    }

    if (dupCodes.size) {
      throw new BadRequestException(
        `So'rov ichida shtrix kod takrorlangan: ${[...dupCodes].join(', ')}`,
      );
    }

    return this.productsRepository.withTransaction(async (manager) => {
      await this.check(manager, CurrencyEntity, currencies, {}, 'Valyuta');
      await this.check(manager, UnitsEntity, units, {}, "O'lchov birligi");
      await this.check(manager, FilesEntity, files, {}, 'Fayl');

      // Bazada band barcode'lar
      const busy: string[] = [];
      for (const part of this.chunk([...codes])) {
        const rows = await manager.find(ProductVariantBarcodesEntity, {
          where: { business_id, barcode: In(part) },
          select: { barcode: true },
        });
        busy.push(...rows.map((r) => r.barcode));
      }

      if (busy.length) {
        throw new ConflictException(`Shtrix kod band: ${busy.join(', ')}`);
      }

      // 1. products
      const productIds: number[] = [];
      for (const part of this.chunk(products)) {
        const res = await manager.insert(
          ProductsEntity,
          part.map((p) => ({
            name: p.name ?? null,
            unit_id: p.unit_id,
            business_id,
          })),
        );
        productIds.push(...res.identifiers.map((r) => r.id as number));
      }

      // 2. product_variants (YANGI: bo'sh artikul va shtrix kodlar to'ldiriladi)
      const variants = products.flatMap((p, i) => {
        const used = new Set(p.variants.map((v) => v.artikul).filter(Boolean));
        return p.variants.map((v) => ({
          ...v,
          product_id: productIds[i],
          artikul: v.artikul || generateArtikul(used),
          barcodes: v.barcodes ?? [],
        }));
      });

      const variantIds: number[] = [];
      for (const part of this.chunk(variants)) {
        const res = await manager.insert(
          ProductVariantsEntity,
          part.map(({ barcodes, ...v }) => ({
            ...v,
            quantity: v.quantity ?? 0,
            alert_quantity: String(v.alert_quantity ?? 0),
            box_quantity: String(v.box_quantity ?? 1),
            allow_below_cost_sale: v.allow_below_cost_sale ?? false,
            purchase_price: String(v.purchase_price),
            retail_price: String(v.retail_price),
            wholesale_price:
              v.wholesale_price != null ? String(v.wholesale_price) : null,
          })),
        );
        variantIds.push(...res.identifiers.map((r) => r.id as number));
      }

      // 3. product_variant_barcodes
      const barcodeRows = variants.flatMap((v, i) =>
        v.barcodes.map((barcode) => ({
          barcode,
          business_id,
          product_variant_id: variantIds[i],
        })),
      );

      for (const part of this.chunk(barcodeRows)) {
        await manager.insert(ProductVariantBarcodesEntity, part);
      }

      return {
        products: productIds.length,
        variants: variantIds.length,
        barcodes: barcodeRows.length,
      };
    });
  }

  async findAll(dto: ProductFilterDto, business_id: number) {
    const {
      page = 1,
      limit = 10,
      search,
      stock_id,
      supplier_id,
      shelf_number_id,
      available_image,
      in_stock,
      available_limit,
      available_barcode,
    } = dto;

    const variantConditions = ['variant.deleted_at IS NULL'];

    if (in_stock === true) {
      variantConditions.push('variant.quantity > 0');
    }

    if (in_stock === false) {
      variantConditions.push('variant.quantity = 0');
    }

    if (available_image === true) {
      variantConditions.push('variant.file_id IS NOT NULL');
    }

    if (available_image === false) {
      variantConditions.push('variant.file_id IS NULL');
    }

    const qb = this.productsRepository
      .qb('product')
      .leftJoinAndSelect('product.unit', 'unit')
      .leftJoinAndSelect(
        'product.variants',
        'variant',
        variantConditions.join(' AND '),
      )
      .leftJoinAndSelect('variant.barcodes', 'barcode')
      .leftJoinAndSelect('variant.purchase_price_currency', 'purchase_currency')
      .leftJoinAndSelect('variant.retail_price_currency', 'retail_currency')
      .leftJoinAndSelect(
        'variant.wholesale_price_currency',
        'wholesale_currency',
      )
      .leftJoinAndSelect('variant.stock', 'stock')
      .leftJoinAndSelect('variant.shelf_number', 'shelf_number')
      .leftJoinAndSelect('variant.image', 'image')
      .leftJoinAndSelect('variant.supplier', 'supplier')
      .where('product.business_id = :business_id', { business_id });

    const s = search?.trim();
    if (s) {
      qb.andWhere(
        `(product.name ILIKE :like OR EXISTS (
        SELECT 1 FROM product_variants pv
        LEFT JOIN product_variant_barcodes pvb ON pvb.product_variant_id = pv.id
        WHERE pv.product_id = product.id
          AND (pv.name ILIKE :like OR pv.artikul ILIKE :like OR pvb.barcode = :code)
      ))`,
        { like: `%${s}%`, code: s },
      );
    }
    if (stock_id) {
      qb.andWhere(
        `EXISTS (
      SELECT 1 FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.stock_id = :stock_id
    )`,
        { stock_id },
      );
    }

    // Ta'minotchi bo'yicha
    if (supplier_id) {
      qb.andWhere(
        `EXISTS (
      SELECT 1 FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.supplier_id = :supplier_id
    )`,
        { supplier_id },
      );
    }

    // Limitga yetgan yoki undan past qoldiqlar
    if (available_limit !== undefined) {
      const condition = `EXISTS (
    SELECT 1 FROM product_variants pv
    WHERE pv.product_id = product.id
      AND pv.deleted_at IS NULL
      AND pv.alert_quantity IS NOT NULL
      AND pv.alert_quantity > 0
  )`;

      qb.andWhere(available_limit ? condition : `NOT ${condition}`);
    }

    // Shtrix kodi bor variantlar
    if (available_barcode !== undefined) {
      const condition = `EXISTS (
    SELECT 1 FROM product_variants pv
    JOIN product_variant_barcodes pvb ON pvb.product_variant_id = pv.id
    WHERE pv.product_id = product.id
      AND pv.deleted_at IS NULL
      AND pvb.deleted_at IS NULL
  )`;

      qb.andWhere(available_barcode ? condition : `NOT ${condition}`);
    }

    // Polka raqami bo'yicha
    if (shelf_number_id) {
      qb.andWhere(
        `EXISTS (
      SELECT 1 FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.shelf_number_id = :shelf_number_id
    )`,
        { shelf_number_id },
      );
    }

    if (available_image === true) {
      qb.andWhere(`
    EXISTS (
      SELECT 1
      FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.file_id IS NOT NULL
    )
  `);
    }

    if (available_image === false) {
      qb.andWhere(`
    EXISTS (
      SELECT 1
      FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.file_id IS NULL
    )
  `);
    }

    if (in_stock === true) {
      qb.andWhere(`
    EXISTS (
      SELECT 1
      FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.quantity > 0
    )
  `);
    }

    if (in_stock === false) {
      qb.andWhere(`
    EXISTS (
      SELECT 1
      FROM product_variants pv
      WHERE pv.product_id = product.id
        AND pv.deleted_at IS NULL
        AND pv.quantity = 0
    )
  `);
    }

    const total = await qb.getCount();

    const rows = await qb
      .orderBy('product.id', 'DESC')
      .addOrderBy('variant.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return this.productsRepository.buildPaginateResult(
      rows,
      total,
      page,
      limit,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async createVariant(
    product_id: number,
    dto: CreateVariantDto,
    business_id: number,
  ) {
    const { barcodes, ...fields } = dto;

    return this.productVariantsRepository.withTransaction(async (manager) => {
      const product = await manager.findOneBy(ProductsEntity, {
        id: product_id,
        business_id,
      });

      if (!product) throw new NotFoundException('Mahsulot topilmadi');

      // Artikul shu tovar ichida takrorlanmasin
      const used = await manager.find(ProductVariantsEntity, {
        where: { product_id },
        select: { artikul: true },
      });

      const taken = new Set(used.map((v) => v.artikul));
      const artikul = fields.artikul || generateArtikul(taken);

      if (fields.artikul && taken.has(fields.artikul)) {
        throw new ConflictException(`Artikul band: ${fields.artikul}`);
      }

      const codes = barcodes ?? [];

      const res = await manager.insert(ProductVariantsEntity, {
        ...fields,
        product_id,
        artikul,
        quantity: fields.quantity ?? 0,
        alert_quantity: String(fields.alert_quantity ?? 0),
        box_quantity: String(fields.box_quantity ?? 1),
        allow_below_cost_sale: fields.allow_below_cost_sale ?? false,
        purchase_price: String(fields.purchase_price),
        retail_price: String(fields.retail_price),
        wholesale_price:
          fields.wholesale_price != null
            ? String(fields.wholesale_price)
            : null,
      });

      const variant_id = res.identifiers[0].id as number;

      await this.syncBarcodes(manager, variant_id, business_id, codes);

      return { id: variant_id };
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    business_id: number,
  ) {
    await this.unitsRepository.findOneOrFail({ id: updateProductDto.unit_id });
    return await this.productsRepository.updateOneOrFail(
      { id, business_id },
      updateProductDto,
    );
  }

  async updateProductVariant(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
    business_id: number,
  ) {
    const { barcodes, ...fields } = updateProductVariantDto;

    return this.productVariantsRepository.withTransaction(async (manager) => {
      const variant = await manager.findOne(ProductVariantsEntity, {
        where: { id },
        relations: { product: true },
      });

      if (!variant || variant.product.business_id !== business_id) {
        throw new NotFoundException('Variant topilmadi');
      }

      const currencies = new Set(
        [
          fields.purchase_price_currency_id,
          fields.retail_price_currency_id,
          fields.wholesale_price_currency_id,
        ].filter(Boolean) as number[],
      );

      await this.check(manager, CurrencyEntity, currencies, {}, 'Valyuta');

      await this.check(
        manager,
        StocksEntity,
        new Set(fields.stock_id ? [fields.stock_id] : []),
        { business_id },
        'Ombor',
      );
      await this.check(
        manager,
        ShelfNumbersEntity,
        new Set(fields.shelf_number_id ? [fields.shelf_number_id] : []),
        { business_id },
        'Javon',
      );
      await this.check(
        manager,
        FilesEntity,
        new Set(fields.file_id ? [fields.file_id] : []),
        {},
        'Fayl',
      );

      // Artikul shu tovar ichida takrorlanmasin
      if (fields.artikul && fields.artikul !== variant.artikul) {
        const exists = await manager.existsBy(ProductVariantsEntity, {
          product_id: variant.product_id,
          artikul: fields.artikul,
        });

        if (exists) {
          throw new ConflictException(`Artikul band: ${fields.artikul}`);
        }
      }

      await manager.update(ProductVariantsEntity, id, {
        ...fields,
        // decimal ustunlar string bo'lib saqlanadi
        purchase_price: fields.purchase_price?.toString(),
        retail_price: fields.retail_price?.toString(),
        wholesale_price:
          fields.wholesale_price != null
            ? String(fields.wholesale_price)
            : undefined,
        alert_quantity:
          fields.alert_quantity != null
            ? String(fields.alert_quantity)
            : undefined,
        box_quantity:
          fields.box_quantity != null ? String(fields.box_quantity) : undefined,
      });

      if (barcodes) {
        await this.syncBarcodes(manager, id, business_id, barcodes);
      }

      return { success: true };
    });
  }

  async remove(id: number, business_id: number) {
    return await this.productsRepository.softDeleteOrFail({ id, business_id });
  }

  async productVariantDelete(id: number, business_id: number) {
    return await this.productVariantsRepository.softDeleteOrFail({
      id,
    });
  }
}
