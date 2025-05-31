import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ProductsModule } from '../products/products.module'; // Para injetar ProductsService
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ProductsModule, // Para disponibilizar ProductsService
    TypeOrmModule.forFeature([Category]), // Para CategoryRepository no AdminController
    MulterModule.register({ // Configuração global do Multer se necessário, ou pode ser local
      dest: './public/uploads', // Um destino padrão, mas o controller sobrescreve
    }),
  ],
  controllers: [AdminController],
  // Providers do AdminModule, se houver (ex: AdminService)
})
export class AdminModule {} 