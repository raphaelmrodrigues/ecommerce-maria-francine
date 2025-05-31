import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'O nome da categoria não pode estar vazio.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O slug da categoria não pode estar vazio.' })
  @IsString()
  // Adicionar @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) se quiser validar formato do slug
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
} 