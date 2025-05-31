import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsBoolean, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(100, { message: 'O nome não pode ter mais de 100 caracteres.' })
  name: string;

  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  @IsEmail({}, { message: 'Formato de email inválido.' })
  email: string;

  @IsNotEmpty({ message: 'O CPF não pode estar vazio.' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'Formato de CPF inválido. Use o formato: 000.000.000-00' })
  cpf: string;

  @IsNotEmpty({ message: 'O telefone não pode estar vazio.' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, { message: 'Formato de telefone inválido. Use o formato: (00) 00000-0000' })
  phone: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  @MaxLength(50, { message: 'A senha não pode ter mais de 50 caracteres.' })
  password: string;

  @IsNotEmpty({ message: 'A confirmação de senha não pode estar vazia.' })
  @IsString()
  @MinLength(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres.' })
  confirmPassword: string;

  // Campos de endereço
  @IsNotEmpty({ message: 'O país não pode estar vazio.' })
  @IsString()
  @MaxLength(2, { message: 'O país deve ter 2 caracteres.' })
  country: string;

  @IsNotEmpty({ message: 'O CEP não pode estar vazio.' })
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, { message: 'Formato de CEP inválido. Use o formato: 00000-000' })
  zip_code: string;

  @IsNotEmpty({ message: 'O logradouro não pode estar vazio.' })
  @IsString()
  @MaxLength(255, { message: 'O logradouro não pode ter mais de 255 caracteres.' })
  street: string;

  @IsNotEmpty({ message: 'O número não pode estar vazio.' })
  @IsString()
  @MaxLength(10, { message: 'O número não pode ter mais de 10 caracteres.' })
  number: string;

  @IsString()
  @MaxLength(100, { message: 'O complemento não pode ter mais de 100 caracteres.' })
  @IsOptional()
  complement?: string;

  @IsNotEmpty({ message: 'O bairro não pode estar vazio.' })
  @IsString()
  @MaxLength(100, { message: 'O bairro não pode ter mais de 100 caracteres.' })
  neighborhood: string;

  @IsNotEmpty({ message: 'A cidade não pode estar vazia.' })
  @IsString()
  @MaxLength(100, { message: 'A cidade não pode ter mais de 100 caracteres.' })
  city: string;

  @IsNotEmpty({ message: 'O estado não pode estar vazio.' })
  @IsString()
  @MaxLength(2, { message: 'O estado deve ter 2 caracteres.' })
  state: string;

  @IsNotEmpty({ message: 'O nome do endereço não pode estar vazio.' })
  @IsString()
  @MaxLength(50, { message: 'O nome do endereço não pode ter mais de 50 caracteres.' })
  address_name: string;

  @IsNotEmpty({ message: 'Você precisa aceitar os termos de uso.' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'Você precisa aceitar os termos de uso.' })
  terms: boolean;
} 