import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../../database/entities/user.entity'; // Ajuste o caminho conforme necessário

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumindo que JwtAuthGuard já populou req.user

    if (!user) {
      // Isso não deveria acontecer se JwtAuthGuard rodou antes e é obrigatório
      throw new ForbiddenException('Acesso negado. Usuário não autenticado.');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Acesso negado. Requer privilégios de administrador.');
    }

    return true;
  }
} 