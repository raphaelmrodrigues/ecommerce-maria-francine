import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as expressLayouts from 'express-ejs-layouts';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import * as cookieParser from 'cookie-parser';
import { AuthExceptionFilter } from './auth/filters/auth-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades não definidas no DTO forem enviadas
      transform: true, // Transforma o payload para o tipo do DTO (ex: string para number)
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita com base nos tipos TS
      },
    }),
  );

  app.useGlobalFilters(new AuthExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  // Configuração do layout
  app.use(expressLayouts);
  app.set('layout', 'layouts/main');
  app.set('layout extractScripts', true);
  app.set('layout extractStyles', true);
  app.set('layout extractMetas', true);
  app.set('layout extractLinks', true);

  // Configurar sessão
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'maria-francine-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    }),
  );

  // Configurar flash messages
  app.use(flash());

  // Configurar variáveis globais para as views
  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
