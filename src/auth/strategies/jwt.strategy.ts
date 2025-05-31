import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // Para buscar o usuário pelo ID do payload
import { User } from '../../database/entities/user.entity';
import { Request } from 'express'; // Adicionar

export interface JwtPayload {
  sub: string; // 'sub' (subject) é o ID do usuário, por convenção do JWT
  email: string;
  // Adicione outros campos que você colocou no payload do JWT ao criá-lo
}

// Função para extrair o JWT do cookie
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    console.log('[JwtStrategy L:16] Cookies recebidos no extractor:', req.cookies);
    token = req.cookies['jwt'];
  }
  console.log('[JwtStrategy L:19] Token extraído do cookie:', token);
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: cookieExtractor, // USAR O EXTRATOR DE COOKIE
      ignoreExpiration: false, // Garante que tokens expirados sejam rejeitados
      secretOrKey: configService.get<string>('JWT_SECRET') || 'MINHA_CHAVE_SECRETA_PADRAO_MUITO_FORTE_E_LONGA_PARA_TESTES',
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'password_hash'>> {
    console.log('[JwtStrategy L:32] Payload recebido para validação:', payload);
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      console.log('[JwtStrategy L:37] Usuário não encontrado para o payload.sub:', payload.sub);
      throw new UnauthorizedException('Token inválido ou usuário não encontrado.');
    }
    console.log('[JwtStrategy L:40] Usuário validado com sucesso:', user.email);
    const { password_hash, ...result } = user;
    return result as Omit<User, 'password_hash'>;
  }
} 