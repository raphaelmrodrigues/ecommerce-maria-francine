import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

// Definir o enum para papéis de usuário
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' }) // Define o nome da tabela como 'users'
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ length: 14, nullable: true }) // CPF com máscara (000.000.000-00)
  cpf: string;

  @Column({ length: 15, nullable: true }) // Telefone com máscara ((00) 00000-0000)
  phone: string;

  @Column({ length: 2, nullable: true }) // País (BR)
  country: string;

  @Column({ length: 9, nullable: true }) // CEP com máscara (00000-000)
  zip_code: string;

  @Column({ length: 255, nullable: true })
  street: string;

  @Column({ length: 10, nullable: true })
  number: string;

  @Column({ length: 100, nullable: true })
  complement: string;

  @Column({ length: 100, nullable: true })
  neighborhood: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 2, nullable: true }) // UF
  state: string;

  @Column({ length: 50, nullable: true }) // Nome do endereço (casa, trabalho, etc)
  address_name: string;

  @Column({ length: 255, nullable: true }) // Endereço completo para compatibilidade
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Futuramente: roles, etc.

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
} 