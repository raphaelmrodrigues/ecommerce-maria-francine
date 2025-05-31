import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Diz ao Passport para usar o campo 'email' como username
      // passwordField: 'password' // padrão já é 'password'
    });
  }

  async validate(email: string, password: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.authService.validateUserCredentials(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }
} 