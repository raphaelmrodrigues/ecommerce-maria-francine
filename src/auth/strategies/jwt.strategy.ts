import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // Para buscar o usuário pelo ID do payload
import { User } from '../../database/entities/user.entity';

export interface JwtPayload {
  sub: string; // 'sub' (subject) é o ID do usuário, por convenção do JWT
  email: string;
  // Adicione outros campos que você colocou no payload do JWT ao criá-lo
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do cabeçalho 'Authorization: Bearer <token>'
      ignoreExpiration: false, // Garante que tokens expirados sejam rejeitados
      secretOrKey: configService.get<string>('JWT_SECRET') || 'MINHA_CHAVE_SECRETA_PADRAO_MUITO_FORTE_E_LONGA_PARA_TESTES',
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'password_hash'>> {
    // O payload aqui é o objeto que foi usado para assinar o JWT (ex: { sub: user.id, email: user.email })
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado.');
    }
    // O Passport anexa este usuário retornado ao objeto request (ex: req.user)
    // Removemos o password_hash antes de retornar
    const { password_hash, ...result } = user;
    return result as Omit<User, 'password_hash'>;
  }
} 