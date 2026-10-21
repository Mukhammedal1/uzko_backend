import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import {
  BulkDeleteDto,
  BulkUpdateProductItemDto,
  BulkUpdateVariantItemDto,
  CreateProductsDto,
  CreateVariantDto,
  ProductFilterDto,
  UpsertVariantItemDto,
} from './dto';
import {
  CurrencyEntity,
  FilesEntity,
  ProductsEntity,
  ProductVariantBarcodesEntity,
  ProductVariantsEntity,
  ShelfNumbersEntity,
  StocksEntity,
  SuppliersEntity,
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
      unit_id,
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

    // Birlik bo'yicha
    if (unit_id) {
      qb.andWhere('product.unit_id = :unit_id', { unit_id });
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

  async findOne(id: number, business_id: number) {
    return await this.productsRepository.findOneOrFail(
      { id, business_id },
      {
        relations: {
          variants: {
            image: true,
            purchase_price_currency: true,
            retail_price_currency: true,
            wholesale_price_currency: true,
            stock: true,
            barcodes: true,
            shelf_number: true,
          },
        },
      },
    );
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

  async bulkUpdateProducts(
    items: BulkUpdateProductItemDto[],
    business_id: number,
  ) {
    if (!items.length) return { updated: 0 };

    return this.productsRepository.withTransaction(async (manager) => {
      // 1) Barcha productlar shu biznesga tegishli ekanini BITTA so'rovda tekshiramiz
      const ids = items.map((i) => i.id);
      const owned = await manager.count(ProductsEntity, {
        where: { id: In(ids), business_id },
      });
      if (owned !== new Set(ids).size) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      // 2) unit_id'larni BITTA so'rovda tekshiramiz
      const unitIds = new Set<number>();
      items.forEach((i) => i.unit_id && unitIds.add(i.unit_id));
      if (unitIds.size) {
        await this.check(manager, UnitsEntity, unitIds, {}, "O'lchov birligi");
      }

      // 3) Product maydonlarini (name, unit_id) BITTA UPDATE...FROM(VALUES) bilan yangilaymiz
      const withProductFields = items.filter(
        (i) => i.name !== undefined || i.unit_id !== undefined,
      );
      if (withProductFields.length) {
        await this.bulkUpdateProductFields(manager, withProductFields);
      }

      // 4) variants ichida id bor — yangilanadi, id yo'q — yangi variant sifatida yaratiladi
      const existingVariantItems: BulkUpdateVariantItemDto[] = [];
      const expectedProductIdByVariantId = new Map<number, number>();
      const newVariantsByProduct = new Map<number, UpsertVariantItemDto[]>();

      for (const item of items) {
        for (const v of item.variants ?? []) {
          if (v.id) {
            existingVariantItems.push(v as BulkUpdateVariantItemDto);
            expectedProductIdByVariantId.set(v.id, item.id);
          } else {
            const list = newVariantsByProduct.get(item.id) ?? [];
            list.push(v);
            newVariantsByProduct.set(item.id, list);
          }
        }
      }

      if (existingVariantItems.length) {
        await this.applyVariantUpdates(
          manager,
          existingVariantItems,
          business_id,
          expectedProductIdByVariantId,
        );
      }

      if (newVariantsByProduct.size) {
        await this.bulkCreateVariants(
          manager,
          business_id,
          newVariantsByProduct,
        );
      }

      return { updated: items.length };
    });
  }

  private async bulkCreateVariants(
    manager: EntityManager,
    business_id: number,
    newVariantsByProduct: Map<number, UpsertVariantItemDto[]>,
  ) {
    const currencies = new Set<number>();
    const files = new Set<number>();
    const codes = new Set<string>();

    for (const variants of newVariantsByProduct.values()) {
      for (const v of variants) {
        [
          v.purchase_price_currency_id,
          v.retail_price_currency_id,
          v.wholesale_price_currency_id,
        ].forEach((id) => id && currencies.add(id));
        if (v.file_id) files.add(v.file_id);
        (v.barcodes ?? []).forEach((c) => codes.add(c));
      }
    }

    await this.check(manager, CurrencyEntity, currencies, {}, 'Valyuta');
    await this.check(manager, FilesEntity, files, {}, 'Fayl');

    if (codes.size) {
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
    }

    // Har bir product bo'yicha mavjud artikullarni olib, yangilariga noyob artikul beramiz
    const productIds = [...newVariantsByProduct.keys()];
    const existingArtikuls = await manager.find(ProductVariantsEntity, {
      where: { product_id: In(productIds) },
      select: { product_id: true, artikul: true },
    });
    const takenByProduct = new Map<number, Set<string>>();
    for (const row of existingArtikuls) {
      const set = takenByProduct.get(row.product_id) ?? new Set<string>();
      set.add(row.artikul);
      takenByProduct.set(row.product_id, set);
    }

    const rows: (UpsertVariantItemDto & {
      product_id: number;
      barcodes: string[];
    })[] = [];

    for (const [product_id, variants] of newVariantsByProduct) {
      const taken = takenByProduct.get(product_id) ?? new Set<string>();
      for (const v of variants) {
        if (v.artikul && taken.has(v.artikul)) {
          throw new ConflictException(`Artikul band: ${v.artikul}`);
        }
        const artikul = v.artikul || generateArtikul(taken);
        taken.add(artikul);
        rows.push({ ...v, product_id, artikul, barcodes: v.barcodes ?? [] });
      }
      takenByProduct.set(product_id, taken);
    }

    const variantIds: number[] = [];
    for (const part of this.chunk(rows)) {
      const res = await manager.insert(
        ProductVariantsEntity,
        part.map(({ barcodes, id, ...v }) => ({
          ...v,
          quantity: v.quantity ?? 0,
          alert_quantity: String(v.alert_quantity ?? 0),
          box_quantity: String(v.box_quantity ?? 1),
          allow_below_cost_sale: v.allow_below_cost_sale ?? false,
          purchase_price:
            v.purchase_price != null ? String(v.purchase_price) : null,
          retail_price: String(v.retail_price),
          wholesale_price:
            v.wholesale_price != null ? String(v.wholesale_price) : null,
        })),
      );
      variantIds.push(...res.identifiers.map((r) => r.id as number));
    }

    const barcodeRows = rows.flatMap((v, i) =>
      v.barcodes.map((barcode) => ({
        barcode,
        business_id,
        product_variant_id: variantIds[i],
      })),
    );
    for (const part of this.chunk(barcodeRows)) {
      await manager.insert(ProductVariantBarcodesEntity, part);
    }
  }

  private async bulkUpdateProductFields(
    manager: EntityManager,
    items: BulkUpdateProductItemDto[],
  ) {
    for (const part of this.chunk(items)) {
      const rows = part.map((i) => [i.id, i.name ?? null, i.unit_id ?? null]);
      const values = rows
        .map(
          (_, idx) =>
            `($${idx * 3 + 1}::int, $${idx * 3 + 2}::varchar, $${idx * 3 + 3}::int)`,
        )
        .join(', ');
      const params = rows.flat();

      await manager.query(
        `
      UPDATE products AS p
      SET
        name = COALESCE(c.name, p.name),
        unit_id = COALESCE(c.unit_id, p.unit_id)
      FROM (VALUES ${values}) AS c(id, name, unit_id)
      WHERE p.id = c.id
      `,
        params,
      );
    }
  }

  async bulkUpdateVariants(
    items: BulkUpdateVariantItemDto[],
    business_id: number,
  ) {
    if (!items.length) return { updated: 0 };

    return this.productVariantsRepository.withTransaction(async (manager) => {
      await this.applyVariantUpdates(manager, items, business_id);
      return { updated: items.length };
    });
  }

  // product_id berilsa — variantlar shu productga tegishli ekani ham tekshiriladi
  // (combined update'da boshqa productning variantini "tasodifan" o'zgartirmaslik uchun)
  private async applyVariantUpdates(
    manager: EntityManager,
    items: BulkUpdateVariantItemDto[],
    business_id: number,
    expectedProductIdByVariantId?: Map<number, number>,
  ) {
    // 1) Barcha variantlar shu biznesga (va kerak bo'lsa aynan shu productga) tegishli ekanini tekshiramiz
    const ids = items.map((i) => i.id);
    const variants = await manager.find(ProductVariantsEntity, {
      where: { id: In(ids) },
      relations: { product: true },
    });

    const byId = new Map(variants.map((v) => [v.id, v]));
    for (const id of ids) {
      const v = byId.get(id);
      const expectedProductId = expectedProductIdByVariantId?.get(id);
      if (
        !v ||
        v.product.business_id !== business_id ||
        (expectedProductId != null && v.product_id !== expectedProductId)
      ) {
        throw new NotFoundException(`Variant topilmadi: ${id}`);
      }
    }

    // 2) Bog'liq ID'larni yig'ib, BITTA so'rovda tekshiramiz
    const currencies = new Set<number>();
    const stocks = new Set<number>();
    const shelves = new Set<number>();
    const files = new Set<number>();
    const suppliers = new Set<number>();

    for (const item of items) {
      [
        item.purchase_price_currency_id,
        item.retail_price_currency_id,
        item.wholesale_price_currency_id,
      ].forEach((id) => id && currencies.add(id));
      if (item.stock_id) stocks.add(item.stock_id);
      if (item.shelf_number_id) shelves.add(item.shelf_number_id);
      if (item.file_id) files.add(item.file_id);
      if (item.supplier_id) suppliers.add(item.supplier_id);
    }

    await this.check(manager, CurrencyEntity, currencies, {}, 'Valyuta');
    await this.check(manager, StocksEntity, stocks, { business_id }, 'Ombor');
    await this.check(
      manager,
      ShelfNumbersEntity,
      shelves,
      { business_id },
      'Javon',
    );
    await this.check(manager, FilesEntity, files, {}, 'Fayl');
    await this.check(
      manager,
      SuppliersEntity,
      suppliers,
      { business_id },
      "Ta'minotchi",
    );

    // 3) Artikul takrorini product_id bo'yicha guruhlab, BITTA so'rovda tekshiramiz
    const withArtikul = items.filter((i) => i.artikul);
    if (withArtikul.length) {
      const productIds = [
        ...new Set(withArtikul.map((i) => byId.get(i.id)!.product_id)),
      ];
      const existing = await manager.find(ProductVariantsEntity, {
        where: { product_id: In(productIds) },
        select: { id: true, product_id: true, artikul: true },
      });

      for (const item of withArtikul) {
        const v = byId.get(item.id)!;
        const clash = existing.find(
          (e) =>
            e.product_id === v.product_id &&
            e.artikul === item.artikul &&
            e.id !== item.id,
        );
        if (clash) throw new ConflictException(`Artikul band: ${item.artikul}`);
      }
    }

    // 4) Asosiy maydonlarni BITTA UPDATE...FROM(VALUES) bilan yangilash
    await this.bulkUpdateVariantFields(manager, items);

    // 5) Shtrix kodlarni batch tarzda sinxronlash
    const withBarcodes = items.filter((i) => i.barcodes);
    if (withBarcodes.length) {
      await this.bulkSyncBarcodes(manager, business_id, withBarcodes);
    }
  }

  // Faqat kelgan maydonlar yangilanadi (COALESCE), qolganlari o'z holida qoladi
  private async bulkUpdateVariantFields(
    manager: EntityManager,
    items: BulkUpdateVariantItemDto[],
  ) {
    const cols = [
      'name',
      'artikul',
      'quantity',
      'alert_quantity',
      'box_quantity',
      'allow_below_cost_sale',
      'purchase_price',
      'purchase_price_currency_id',
      'retail_price',
      'retail_price_currency_id',
      'retail_price_percentage',
      'wholesale_price',
      'wholesale_price_currency_id',
      'wholesale_price_percentage',
      'stock_id',
      'shelf_number_id',
      'file_id',
      'supplier_id',
    ];
    const colTypes = [
      'varchar',
      'varchar',
      'int',
      'decimal',
      'decimal',
      'boolean',
      'decimal',
      'int',
      'decimal',
      'int',
      'decimal',
      'decimal',
      'int',
      'decimal',
      'int',
      'int',
      'int',
      'int',
    ];

    const rows = items.map((i) => [
      i.id,
      i.name ?? null,
      i.artikul ?? null,
      i.quantity ?? null,
      i.alert_quantity != null ? String(i.alert_quantity) : null,
      i.box_quantity != null ? String(i.box_quantity) : null,
      i.allow_below_cost_sale ?? null,
      i.purchase_price != null ? String(i.purchase_price) : null,
      i.purchase_price_currency_id ?? null,
      i.retail_price != null ? String(i.retail_price) : null,
      i.retail_price_currency_id ?? null,
      i.retail_price_percentage != null
        ? String(i.retail_price_percentage)
        : null,
      i.wholesale_price != null ? String(i.wholesale_price) : null,
      i.wholesale_price_currency_id ?? null,
      i.wholesale_price_percentage != null
        ? String(i.wholesale_price_percentage)
        : null,
      i.stock_id ?? null,
      i.shelf_number_id ?? null,
      i.file_id ?? null,
      i.supplier_id ?? null,
    ]);

    // Postgres parametr limiti tufayli chunk qilamiz (500 qator × 19 ustun = 9500 param)
    for (const part of this.chunk(rows, 500)) {
      const nParams = cols.length + 1;
      const valuesSql = part
        .map(
          (_, r) =>
            `($${r * nParams + 1}::int, ${colTypes
              .map((t, c) => `$${r * nParams + c + 2}::${t}`)
              .join(', ')})`,
        )
        .join(', ');
      const params = part.flat();

      const setClauses = cols
        .map((c) => `${c} = COALESCE(c.${c}, v.${c})`)
        .join(',\n          ');

      await manager.query(
        `
        UPDATE product_variants AS v
        SET ${setClauses}
        FROM (VALUES ${valuesSql}) AS c(id, ${cols.join(', ')})
        WHERE v.id = c.id
        `,
        params,
      );
    }
  }

  private async bulkSyncBarcodes(
    manager: EntityManager,
    business_id: number,
    items: { id: number; barcodes?: string[] }[],
  ) {
    const variantIds = items.map((i) => i.id);

    // Barcha joriy kodlarni BITTA so'rovda olamiz
    const current = await manager.find(ProductVariantBarcodesEntity, {
      where: { product_variant_id: In(variantIds) },
      select: { id: true, barcode: true, product_variant_id: true },
    });

    const byVariant = new Map<number, typeof current>();
    for (const row of current) {
      const list = byVariant.get(row.product_variant_id) ?? [];
      list.push(row);
      byVariant.set(row.product_variant_id, list);
    }

    const toInsert: {
      barcode: string;
      business_id: number;
      product_variant_id: number;
    }[] = [];
    const toRemoveIds: number[] = [];
    const newCodes = new Set<string>();

    for (const item of items) {
      const codes = item.barcodes ?? [];
      const currentRows = byVariant.get(item.id) ?? [];
      const currentCodes = currentRows.map((c) => c.barcode);

      for (const code of codes) {
        if (!currentCodes.includes(code)) {
          toInsert.push({
            barcode: code,
            business_id,
            product_variant_id: item.id,
          });
          newCodes.add(code);
        }
      }
      for (const row of currentRows) {
        if (!codes.includes(row.barcode)) toRemoveIds.push(row.id);
      }
    }

    if (newCodes.size) {
      const busy: string[] = [];
      for (const part of this.chunk([...newCodes])) {
        const rows = await manager.find(ProductVariantBarcodesEntity, {
          where: { business_id, barcode: In(part) },
          select: { barcode: true },
        });
        busy.push(...rows.map((r) => r.barcode));
      }
      if (busy.length)
        throw new ConflictException(`Shtrix kod band: ${busy.join(', ')}`);
    }

    for (const part of this.chunk(toInsert)) {
      await manager.insert(ProductVariantBarcodesEntity, part);
    }
    if (toRemoveIds.length) {
      await manager.softDelete(ProductVariantBarcodesEntity, toRemoveIds);
    }
  }

  async bulkRemove(dto: BulkDeleteDto, business_id: number) {
    const product_ids = dto.product_ids ?? [];
    const variant_ids = dto.variant_ids ?? [];

    if (!product_ids.length && !variant_ids.length) {
      return { products: 0, variants: 0 };
    }

    return this.productsRepository.withTransaction(async (manager) => {
      let deletedProducts = 0;
      let deletedVariants = 0;

      // Productlar — business_id bilan birga BITTA UPDATE'da (TypeORM bu ikkisini
      // bitta WHERE'ga birlashtiradi, chetga tegishli bo'lsa shunchaki o'chmaydi)
      if (product_ids.length) {
        for (const part of this.chunk(product_ids)) {
          const res = await manager.softDelete(ProductsEntity, {
            id: In(part),
            business_id,
          });
          deletedProducts += res.affected ?? 0;
        }
      }

      // Variantlar — product orqali business_id tekshiriladi (join), bitta raw UPDATE
      if (variant_ids.length) {
        for (const part of this.chunk(variant_ids)) {
          const rows = await manager.query(
            `
            UPDATE product_variants AS v
            SET deleted_at = now()
            FROM products AS p
            WHERE v.product_id = p.id
              AND p.business_id = $1
              AND v.id = ANY($2::int[])
              AND v.deleted_at IS NULL
            RETURNING v.id
            `,
            [business_id, part],
          );
          deletedVariants += rows.length;
        }
      }

      return { products: deletedProducts, variants: deletedVariants };
    });
  }
}
