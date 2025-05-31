import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Render, Res, Redirect, UnauthorizedException, Req, BadRequestException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from '../database/entities/user.entity';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthGuardOptional } from './guards/jwt-auth-optional.guard';

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
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterAuthDto, @Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json({ message: 'Cadastro realizado com sucesso! Você será redirecionado para o login.' });
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ConflictException || error instanceof BadRequestException) {
        return res.status(error.getStatus()).json({ message: error.message, details: error.getResponse ? error.getResponse() : undefined });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno ao processar o cadastro.', details: error.message });
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginAuthDto,
    @Req() req: Request & { user: Omit<User, 'password_hash'> },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      console.log('[AuthController] Usuário autenticado pelo LocalAuthGuard:', req.user);
      console.log('[AuthController] Login DTO (com remember):', loginDto);

      const { access_token, user: loggedInUser } = await this.authService.login(req.user);
      
      console.log('[AuthController] Access Token gerado:', access_token);
      console.log('[AuthController] Usuário logado (do authService.login):', loggedInUser);
      
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const thirtyDaysInMs = 30 * oneDayInMs;
      const cookieMaxAge = loginDto.remember ? thirtyDaysInMs : oneDayInMs;

      console.log(`[AuthController] Lembrar-me: ${loginDto.remember}. Duração do cookie: ${cookieMaxAge / oneDayInMs} dia(s)`);

      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: cookieMaxAge, 
        path: '/',
      });
      console.log('[AuthController] Cookie JWT configurado.');

      return { 
        message: 'Login bem-sucedido!', 
        user: loggedInUser 
      };

    } catch (error) {
      console.error('[AuthController] Erro interno durante o processo de login (após guarda):', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Falha ao processar o login após autenticação.');
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt', { path: '/' });
    return res.status(HttpStatus.OK).json({ message: 'Logout realizado com sucesso.' });
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

  @UseGuards(JwtAuthGuardOptional)
  @Get('status')
  async getAuthStatus(@Req() req: Request & { user?: Omit<User, 'password_hash'> }) {
    console.log('[AuthController L:88] Chamada para /auth/status');
    console.log('[AuthController L:89] Cookies na requisição /auth/status:', req.cookies);
    console.log('[AuthController L:90] req.user em /auth/status (após JwtAuthGuardOptional):', req.user);
    if (req.user) {
      return { isAuthenticated: true, user: req.user };
    } else {
      return { isAuthenticated: false };
    }
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
