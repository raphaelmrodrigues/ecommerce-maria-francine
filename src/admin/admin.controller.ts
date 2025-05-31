import { Controller, Get, Post, Render, UseGuards, Body, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { Category } from '../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Get()
  @Render('admin/dashboard')
  adminDashboard() {
    return { title: 'Painel Administrativo' };
  }

  @Get('products/create')
  @Render('admin/products/create-product')
  async showCreateProductForm() {
    const categories = await this.categoryRepository.find();
    return { 
        title: 'Criar Novo Produto', 
        categories,
        productData: {},
        error: null 
    };
  }

  @Post('products/create')
  @UseInterceptors(FilesInterceptor('productImages', 6, {
      storage: diskStorage({
          destination: './public/uploads/products',
          filename: (req, file, cb) => {
              const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
              cb(null, `${randomName}${extname(file.originalname)}`);
          },
      }),
      fileFilter: (req, file, cb) => {
          console.log(`Arquivo recebido no fileFilter: Originalname: ${file.originalname}, Mimetype: '${file.mimetype}'`);
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              console.log(`FileFilter: Rejeitando ${file.originalname} devido à extensão.`);
              return cb(new Error('Apenas arquivos de imagem (jpg, jpeg, png, gif, webp) são permitidos pela extensão!'), false);
          }
          console.log(`FileFilter: Aceitando ${file.originalname}.`);
          cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 } 
  }))
  async createProduct(
      @Body() createProductDto: CreateProductDto,
      @UploadedFiles(
          new ParseFilePipe({
              validators: [
                  new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                  // new FileTypeValidator({ fileType: 'image/jpeg' }), // Temporariamente comentado
              ],
              fileIsRequired: false, 
          }),
      )
      productImages: Array<Express.Multer.File>,
      @Res() res: Response,
      @Req() req: any
  ) {
      try {
          const newProduct = await this.productsService.create(createProductDto, productImages);
          
          req.flash('success', `Produto "${newProduct.name}" criado com sucesso!`); 
          return res.redirect('/admin/products/create');

      } catch (error) {
          console.error('Erro ao criar produto:', error);
          const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
          req.flash('error', errorMessage);
          return res.redirect('/admin/products/create');
      }
  }

  @Get('categories')
  @Render('admin/categories/list-categories')
  async listCategories() {
    const categories = await this.categoryRepository.find({ order: { name: 'ASC' } });
    return { 
      title: 'Gerenciar Categorias', 
      categories,
      layout: 'layouts/main'
    };
  }

  @Get('categories/create')
  @Render('admin/categories/create-category')
  async showCreateCategoryForm() {
    return { 
      title: 'Criar Nova Categoria',
      categoryData: {},
      error: null,
      layout: 'layouts/main'
    };
  }

  @Post('categories/create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
    @Req() req: any
  ) {
    try {
      const existingCategoryBySlug = await this.categoryRepository.findOneBy({ slug: createCategoryDto.slug });
      if (existingCategoryBySlug) {
        req.flash('error', 'Já existe uma categoria com este slug.');
        return res.redirect('/admin/categories/create');
      }
      const newCategory = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(newCategory);
      req.flash('success', `Categoria "${newCategory.name}" criada com sucesso!`);
      return res.redirect('/admin/categories');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido ao criar a categoria.';
      req.flash('error', errorMessage);
      return res.redirect('/admin/categories/create');
    }
  }
} 