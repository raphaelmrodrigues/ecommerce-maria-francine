import { Controller, Get, Param, Query, Render, NotFoundException } from '@nestjs/common';
import { ProductsService, ProductFilters, PaginatedResponse } from './products.service';

@Controller('produtos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Render('products/index')
  async index(
    @Query('page') page = '1',
    @Query('limit') limit = '12',
    @Query('sort') sort = 'relevance',
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sizes') sizes?: string,
    @Query('colors') colors?: string,
    @Query('promoOnly') promoOnly?: string,
  ) {
    const filters: ProductFilters = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sizes: sizes ? sizes.split(',') : undefined,
      colors: colors ? colors.split(',') : undefined,
      promoOnly: promoOnly === 'true',
    };

    const { products, total, totalPages } = await this.productsService.findAll(filters);

    return {
      title: 'Produtos',
      products,
      pagination: {
        currentPage: filters.page,
        totalPages,
        total,
        hasNext: filters.page < totalPages,
        hasPrev: filters.page > 1,
      },
    };
  }

  @Get(':slug')
  @Render('products/show')
  async show(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Buscar produtos relacionados da mesma categoria
    const relatedProducts = await this.productsService.findRelatedProducts(
      product.id,
      product.category_id,
      4
    );

    return {
      title: product.name,
      product,
      relatedProducts,
    };
  }

  @Get('categoria/:slug')
  @Render('products/category')
  async findByCategory(
    @Param('slug') slug: string,
    @Query('page') page = '1',
    @Query('limit') limit = '12',
    @Query('sort') sort = 'relevance',
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sizes') sizes?: string,
    @Query('colors') colors?: string,
    @Query('promoOnly') promoOnly?: string,
  ) {
    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sizes: sizes ? sizes.split(',') : undefined,
      colors: colors ? colors.split(',') : undefined,
      promoOnly: promoOnly === 'true',
    };

    const { products, total, totalPages, category } = await this.productsService.findByCategory(slug, filters);

    if (!category) {
      throw new NotFoundException(`Categoria com slug ${slug} não encontrada`);
    }

    return {
      title: category.name,
      products,
      category,
      filters,
      pagination: {
        currentPage: filters.page,
        totalPages,
        total,
        hasNext: filters.page < totalPages,
        hasPrev: filters.page > 1,
      },
    };
  }
} 