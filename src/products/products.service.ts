import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In, Not } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';
import { ProductImage } from '../database/entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Express } from 'express';

export interface ProductFilters {
  page: number;
  limit: number;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  promoOnly?: boolean;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto, productImages?: Array<Express.Multer.File>): Promise<Product> {
    const { category_id, ...productData } = createProductDto;

    const category = await this.categoriesRepository.findOneBy({ id: category_id });
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${category_id} não encontrada.`);
    }

    delete productData.mainImageUrl;

    const product = this.productsRepository.create({
      ...productData,
      category: category,
    });

    const savedProduct = await this.productsRepository.save(product);

    if (productImages && productImages.length > 0) {
      for (let i = 0; i < productImages.length; i++) {
        const imageFile = productImages[i];
        const newImage = this.productImageRepository.create({
          url: `/uploads/products/${imageFile.filename}`,
          product: savedProduct,
          order: i + 1,
        });
        await this.productImageRepository.save(newImage);
      }
    }
    return this.findOne(savedProduct.slug);
  }

  async findAll(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    // Aplicar filtros
    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Reabilitado para MySQL usando JSON_CONTAINS
    if (filters.sizes && filters.sizes.length > 0) {
      const sizeConditions = filters.sizes.map((size, index) => `JSON_CONTAINS(product.sizes, :sizeFilter${index})`).join(' OR ');
      const sizeParameters = filters.sizes.reduce((params, size, index) => {
        params[`sizeFilter${index}`] = JSON.stringify(size); // Garante que o valor seja uma string JSON válida (ex: "P")
        return params;
      }, {});
      queryBuilder.andWhere(`(${sizeConditions})`, sizeParameters);
    }

    // Reabilitado para MySQL usando JSON_CONTAINS
    if (filters.colors && filters.colors.length > 0) {
      const colorConditions = filters.colors.map((color, index) => `JSON_CONTAINS(product.colors, :colorFilter${index})`).join(' OR ');
      const colorParameters = filters.colors.reduce((params, color, index) => {
        params[`colorFilter${index}`] = JSON.stringify(color);
        return params;
      }, {});
      queryBuilder.andWhere(`(${colorConditions})`, colorParameters);
    }

    if (filters.promoOnly) {
      queryBuilder.andWhere('product.on_sale = :onSale', { onSale: true });
    }

    // Aplicar ordenação
    switch (filters.sort) {
      case 'price_asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.created_at', 'DESC');
        break;
      default: // relevance
        queryBuilder.orderBy('product.featured', 'DESC')
          .addOrderBy('product.created_at', 'DESC');
    }

    // Calcular paginação
    const skip = (filters.page - 1) * filters.limit;
    queryBuilder.skip(skip).take(filters.limit);

    // Executar query
    const [products, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / filters.limit);

    return { products, total, totalPages };
  }

  async findOne(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Produto com slug ${slug} não encontrado`);
    }

    return product;
  }

  async findByCategory(
    categorySlug: string,
    filters: ProductFilters,
  ): Promise<PaginatedResponse<Product> & { category: Category }> {
    const category = await this.categoriesRepository.findOne({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com slug ${categorySlug} não encontrada`);
    }

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('category.slug = :categorySlug', { categorySlug });

    // Aplicar filtros
    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.sizes && filters.sizes.length > 0) {
      queryBuilder.andWhere('product.sizes @> :sizes', { sizes: filters.sizes });
    }

    if (filters.colors && filters.colors.length > 0) {
      queryBuilder.andWhere('product.colors @> :colors', { colors: filters.colors });
    }

    if (filters.promoOnly) {
      queryBuilder.andWhere('product.on_sale = :onSale', { onSale: true });
    }

    // Aplicar ordenação
    switch (filters.sort) {
      case 'price_asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.created_at', 'DESC');
        break;
      default: // relevance
        queryBuilder.orderBy('product.featured', 'DESC')
          .addOrderBy('product.created_at', 'DESC');
    }

    // Calcular paginação
    const skip = (filters.page - 1) * filters.limit;
    queryBuilder.skip(skip).take(filters.limit);

    // Executar query
    const [products, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / filters.limit);

    return { products, total, totalPages, category };
  }

  async findRelated(product: Product): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('related')
      .leftJoinAndSelect('related.category', 'category')
      .leftJoinAndSelect('related.images', 'images')
      .where('related.id != :productId', { productId: product.id })
      .andWhere('related.category_id = :categoryId', { categoryId: product.category.id })
      .orderBy('related.featured', 'DESC')
      .addOrderBy('related.created_at', 'DESC')
      .take(4)
      .getMany();
  }

  async findFeatured(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { featured: true },
      relations: ['category', 'images'],
      take: 8,
      order: { created_at: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'images'],
    });
  }

  async findRelatedProducts(
    currentProductId: number,
    categoryId: number,
    limit: number,
  ): Promise<Product[]> {
    return this.productsRepository.find({
      where: {
        category_id: categoryId,
        id: Not(currentProductId),
      },
      relations: ['category', 'images'],
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }
} 