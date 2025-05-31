import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from './pages.controller';
import { Category } from '../database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Importar Category se for usá-lo aqui
  controllers: [PagesController],
})
export class PagesModule {} 