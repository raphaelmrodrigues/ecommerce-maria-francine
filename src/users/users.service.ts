import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto'; // Usaremos para tipar os dados de criação
import * as bcrypt from 'bcrypt';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  country: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  address_name: string;
  address?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserData): Promise<Omit<User, 'password_hash'>> {
    // Verificar se o email já está em uso
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Verificar se o CPF já está em uso
    const existingCpf = await this.findByCpf(data.cpf);
    if (existingCpf) {
      throw new ConflictException('Este CPF já está cadastrado');
    }

    // Hash da senha
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    // Criar o usuário
    const user = this.usersRepository.create({
      ...data,
      password_hash,
    });

    await this.usersRepository.save(user);

    // Remover o hash da senha antes de retornar
    const { password_hash: _, ...result } = user;
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneByEmail(email);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { cpf } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    const user = await this.findOneById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se estiver atualizando a senha, fazer o hash
    if (data.password_hash) {
      const saltRounds = 10;
      data.password_hash = await bcrypt.hash(data.password_hash, saltRounds);
    }

    await this.usersRepository.update(id, data);
  }

  // Outros métodos como deleteUser podem ser adicionados aqui
}
