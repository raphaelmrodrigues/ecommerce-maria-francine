import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './strategies/jwt.strategy'; // Importar JwtPayload

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto): Promise<void> {
    // Verificar se as senhas coincidem
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('As senhas não coincidem');
    }

    // Verificar se o usuário já existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Este email já está em uso');
    }

    // Verificar se o CPF já está em uso
    const existingCpf = await this.usersService.findByCpf(registerDto.cpf);
    if (existingCpf) {
      throw new UnauthorizedException('Este CPF já está cadastrado');
    }

    // Verificar se os termos foram aceitos
    if (!registerDto.terms) {
      throw new UnauthorizedException('Você precisa aceitar os termos de uso');
    }

    // Criar o usuário com todos os campos
    await this.usersService.createUser({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      cpf: registerDto.cpf,
      phone: registerDto.phone,
      country: registerDto.country,
      zip_code: registerDto.zip_code,
      street: registerDto.street,
      number: registerDto.number,
      complement: registerDto.complement,
      neighborhood: registerDto.neighborhood,
      city: registerDto.city,
      state: registerDto.state,
      address_name: registerDto.address_name,
      // Criar endereço completo para compatibilidade
      address: `${registerDto.street}, ${registerDto.number}${registerDto.complement ? ` - ${registerDto.complement}` : ''}, ${registerDto.neighborhood}, ${registerDto.city}/${registerDto.state}, ${registerDto.zip_code}`,
    });
  }

  async validateUserCredentials(email: string, password: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }

    // Remover o hash da senha antes de retornar
    const { password_hash, ...result } = user;
    return result;
  }

  async login(user: Omit<User, 'password_hash'>) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async updateProfile(userId: string, data: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    address?: string;
  }): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersService.findOneById(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Se estiver alterando a senha
    if (data.currentPassword && data.newPassword) {
      const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password_hash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Senha atual incorreta');
      }

      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds);
      
      // Atualizar a senha
      await this.usersService.updateUser(userId, {
        password_hash: hashedPassword,
      });
    }

    // Atualizar outros dados
    const updateData: Partial<User> = {};
    if (data.name) updateData.name = data.name;
    if (data.address) updateData.address = data.address;

    if (Object.keys(updateData).length > 0) {
      await this.usersService.updateUser(userId, updateData);
    }

    // Retornar usuário atualizado
    const updatedUser = await this.usersService.findOneById(userId);
    if (!updatedUser) {
      throw new UnauthorizedException('Erro ao atualizar perfil');
    }

    const { password_hash, ...result } = updatedUser;
    return result;
  }

  async getLoggedInUser(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const { password_hash, ...result } = user;
    return result;
  }
}
