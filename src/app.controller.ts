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
    const produtosFromService = await this.productsService.findFeatured();
    // Garante que price e sale_price sejam números
    const produtos = produtosFromService.map(p => ({
      ...p,
      price: parseFloat(p.price as any), 
      sale_price: p.sale_price ? parseFloat(p.sale_price as any) : null,
    }));
    return {
      produtos,
      title: 'Maria Francine - Vestidos Infantis',
      message: 'Bem-vindo à nossa loja'
    };
  }
}
