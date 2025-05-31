import { Controller, Get, Render } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { Repository } from 'typeorm';

@Controller()
export class PagesController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Get('categorias')
  @Render('pages/categories') // View para listar todas as categorias
  async listCategories() {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' }, // Ordenar por nome
    });
    return {
      title: 'Categorias de Produtos',
      categories,
    };
  }

  @Get('sobre')
  @Render('pages/about') // View para "Sobre Nós"
  aboutPage() {
    return {
      title: 'Sobre Nós',
    };
  }

  @Get('contato')
  @Render('pages/contact') // View para "Contato"
  contactPage() {
    return {
      title: 'Contato',
    };
  }
} 