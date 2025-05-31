import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from '../database/entities/category.entity';
import { ProductImage } from '../database/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {} 