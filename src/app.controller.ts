import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @Render('home')
  async getHome() {
    const produtos = await this.productsService.findFeatured();
    return {
      produtos,
      title: 'Maria Francine - Vestidos Infantis',
      message: 'Bem-vindo à nossa loja'
    };
  }
}
