import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule, // Para acessar UsersService
    PassportModule.register({ defaultStrategy: 'jwt' }), // Define jwt como estratégia padrão
    JwtModule.registerAsync({
      imports: [ConfigModule], // Para usar ConfigService para buscar o segredo JWT
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'MINHA_CHAVE_SECRETA_PADRAO_MUITO_FORTE_E_LONGA_PARA_TESTES',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s', // Ex: 1 hora
        },
      }),
    }),
    ConfigModule, // Garante que ConfigModule está disponível se não for global no app.module
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, JwtModule, PassportModule], // Exportar JwtModule e PassportModule pode ser útil
})
export class AuthModule {}
