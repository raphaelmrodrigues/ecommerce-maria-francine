import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Render, Res, Redirect, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../database/entities/user.entity';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  showLoginPage(@Req() req: Request) {
    return {
      title: 'Login',
      error: req.flash('error'),
      email: req.flash('email')[0],
    };
  }

  @Get('register')
  @Render('auth/register')
  showRegisterPage(@Req() req: Request) {
    return {
      title: 'Cadastro',
      error: req.flash('error'),
      ...req.flash('formData')[0],
    };
  }

  @Post('register')
  @Redirect('/auth/login')
  async register(@Body() registerDto: RegisterAuthDto, @Req() req: Request) {
    try {
      console.log('Dados recebidos:', registerDto);
      await this.authService.register(registerDto);
      req.flash('success', 'Cadastro realizado com sucesso! Faça login para continuar.');
    } catch (error) {
      console.error('Erro no registro:', error);
      req.flash('error', error.message || 'Erro ao realizar cadastro');
      req.flash('formData', registerDto);
      throw new UnauthorizedException(error.message || 'Erro ao realizar cadastro');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginAuthDto,
    @Req() req: Request & { user: Omit<User, 'password_hash'> },
    @Res() res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.login(req.user);
      
      // Configurar cookie com o token JWT
      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      // Redirecionar para a página inicial
      res.redirect('/');
    } catch (error) {
      req.flash('error', error.message);
      req.flash('email', loginDto.email);
      res.redirect('/auth/login');
    }
  }

  @Get('logout')
  @Redirect('/')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Render('auth/profile')
  async getProfile(@Req() req: Request & { user: Omit<User, 'password_hash'> }) {
    const user = await this.authService.getLoggedInUser(req.user.id);
    const tab = req.query.tab || 'profile';

    return {
      title: 'Meu Perfil',
      user,
      activeTab: tab,
      error: req.flash('error'),
      success: req.flash('success'),
    };
  }

  // Exemplo de rota protegida que requer um JWT válido
  // @UseGuards(AuthGuard('jwt'))
  // @Get('profile')
  // getProfile(@Request() req: { user: Omit<User, 'password_hash'> }) {
  //   return req.user;
  // }

  // Rota para renderizar a página de login (exemplo)
  // @Get('login')
  // @Render('login')
  // showLoginPage() {
  //   return { message: 'Faça seu login' };
  // }

  // Rota para renderizar a página de registro (exemplo)
  // @Get('register')
  // @Render('register')
  // showRegisterPage() {
  //   return { message: 'Crie sua conta' };
  // }
}
