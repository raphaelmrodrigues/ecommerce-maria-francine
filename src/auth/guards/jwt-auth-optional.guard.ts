import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuardOptional extends AuthGuard('jwt') {
  handleRequest(err, user, info, context, status) {
    // Não lança erro se o usuário não for encontrado ou o token for inválido
    // Apenas retorna o usuário se a autenticação for bem-sucedida, ou undefined caso contrário
    return user;
  }
} 