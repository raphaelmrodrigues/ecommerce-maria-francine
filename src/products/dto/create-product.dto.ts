import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, Min, IsInt, ValidateNested, ArrayMinSize, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'O nome do produto não pode estar vazio.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O slug do produto não pode estar vazio.' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'O preço não pode estar vazio.' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número com no máximo 2 casas decimais.' })
  @Min(0.01, { message: 'O preço deve ser maior que zero.' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço promocional deve ser um número com no máximo 2 casas decimais.' })
  @Min(0.01, { message: 'O preço promocional deve ser maior que zero.' })
  @Type(() => Number)
  sale_price?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  on_sale?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @IsNotEmpty({ message: 'A quantidade em estoque não pode estar vazia.' })
  @IsInt({ message: 'A quantidade em estoque deve ser um número inteiro.' })
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa.' })
  @Type(() => Number)
  stock_quantity: number;

  @IsOptional()
  @IsArray({ message: 'Os tamanhos devem ser um array.' })
  @IsString({ each: true, message: 'Cada tamanho deve ser uma string.' })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map(item => item.trim()).filter(item => item) : value)
  sizes?: string[];

  @IsOptional()
  @IsArray({ message: 'As cores devem ser um array.' })
  @IsString({ each: true, message: 'Cada cor deve ser uma string.' })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map(item => item.trim()).filter(item => item) : value)
  colors?: string[];
  
  @IsOptional()
  @IsArray({ message: 'As tags devem ser um array.' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string.' })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map(item => item.trim()).filter(item => item) : value)
  tags?: string[];

  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  @IsUUID('4', { message: 'O ID da categoria deve ser um UUID válido.' })
  category_id: string;

  @IsOptional()
  @IsString()
  mainImageUrl?: string;
} 