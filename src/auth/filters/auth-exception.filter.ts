import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException) // Captura todas as HttpExceptions, incluindo Unauthorized e Forbidden
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof UnauthorizedException) {
      // Se for Unauthorized (geralmente token ausente/inválido), redireciona para login
      // Mas apenas se não for uma requisição XHR/fetch que espera JSON
      if (request.headers['accept'] && !request.headers['accept'].includes('application/json')) {
        response.redirect('/auth/login');
      } else {
        // Para requisições API (fetch), envia a resposta JSON padrão do NestJS
        response.status(status).json(exception.getResponse());
      }
    } else if (exception instanceof ForbiddenException) {
      // Se for Forbidden (ex: não admin tentando acessar área admin)
      // Mostra uma mensagem de erro. Poderíamos renderizar uma view ou redirecionar com flash.
      // Por enquanto, vamos usar flash e redirecionar para a home ou login.
      const req = ctx.getRequest(); // Para acessar req.flash
      if (req.flash) { // Verifica se flash existe (pode não existir em testes unitários)
         req.flash('error', exception.message || 'Você não tem permissão para acessar esta página.');
      }
      // Redirecionar para a página inicial se for uma requisição de navegador
      if (request.headers['accept'] && !request.headers['accept'].includes('application/json')) {
        response.redirect('/'); 
      } else {
        response.status(status).json(exception.getResponse());
      }
    } else {
      // Para outras HttpExceptions, deixa o NestJS lidar ou envia a resposta JSON
      response.status(status).json(exception.getResponse());
    }
  }
} 