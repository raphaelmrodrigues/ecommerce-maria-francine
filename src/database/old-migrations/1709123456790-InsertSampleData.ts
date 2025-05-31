import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSampleData1709123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Inserir categorias
    await queryRunner.query(`
      INSERT INTO categories (id, name, description, slug, created_at, updated_at)
      VALUES 
        (UUID(), 'Vestidos de Festa', 'Vestidos elegantes para ocasiões especiais', 'vestidos-festa', NOW(), NOW()),
        (UUID(), 'Festa Junina', 'Vestidos tradicionais para festa junina', 'festa-junina', NOW(), NOW()),
        (UUID(), 'Aniversário', 'Vestidos especiais para aniversário', 'aniversario', NOW(), NOW())
    `);

    // Buscar IDs das categorias
    const [vestidosFesta] = await queryRunner.query(`SELECT id FROM categories WHERE slug = 'vestidos-festa'`);
    const [festaJunina] = await queryRunner.query(`SELECT id FROM categories WHERE slug = 'festa-junina'`);
    const [aniversario] = await queryRunner.query(`SELECT id FROM categories WHERE slug = 'aniversario'`);

    // Inserir produtos
    await queryRunner.query(`
      INSERT INTO products (
        id, name, slug, description, price, sale_price, on_sale, featured, 
        stock_quantity, sizes, colors, tags, category_id, created_at, updated_at
      ) VALUES 
        (
          UUID(), 
          'Vestido Princesa Rosa', 
          'vestido-princesa-rosa',
          'Vestido de festa rosa com detalhes em renda e laço na cintura. Perfeito para ocasiões especiais.',
          299.90,
          249.90,
          true,
          true,
          10,
          '["PP", "P", "M", "G"]',
          '["Rosa", "Branco"]',
          '["Festa", "Princesa", "Renda"]',
          '${vestidosFesta.id}',
          NOW(),
          NOW()
        ),
        (
          UUID(),
          'Vestido Festa Junina Azul',
          'vestido-festa-junina-azul',
          'Vestido tradicional de festa junina em azul com detalhes em chita. Ideal para a festa mais animada do ano.',
          199.90,
          null,
          false,
          true,
          15,
          '["P", "M", "G"]',
          '["Azul", "Branco"]',
          '["Festa Junina", "Tradicional"]',
          '${festaJunina.id}',
          NOW(),
          NOW()
        ),
        (
          UUID(),
          'Vestido Aniversário Lilás',
          'vestido-aniversario-lilas',
          'Vestido de aniversário em lilás com detalhes em tule e flores. Perfeito para celebrar seu dia especial.',
          279.90,
          239.90,
          true,
          true,
          8,
          '["PP", "P", "M"]',
          '["Lilás", "Rosa"]',
          '["Aniversário", "Tule", "Flores"]',
          '${aniversario.id}',
          NOW(),
          NOW()
        ),
        (
          UUID(),
          'Vestido Princesa Azul',
          'vestido-princesa-azul',
          'Vestido de festa azul com detalhes em renda e laço nas costas. Ideal para ocasiões especiais.',
          289.90,
          null,
          false,
          false,
          12,
          '["PP", "P", "M", "G"]',
          '["Azul", "Branco"]',
          '["Festa", "Princesa", "Renda"]',
          '${vestidosFesta.id}',
          NOW(),
          NOW()
        ),
        (
          UUID(),
          'Vestido Festa Junina Vermelho',
          'vestido-festa-junina-vermelho',
          'Vestido tradicional de festa junina em vermelho com detalhes em chita. Perfeito para a festa mais animada.',
          189.90,
          159.90,
          true,
          false,
          20,
          '["P", "M", "G", "GG"]',
          '["Vermelho", "Branco"]',
          '["Festa Junina", "Tradicional"]',
          '${festaJunina.id}',
          NOW(),
          NOW()
        )
    `);

    // Buscar IDs dos produtos para inserir imagens
    const produtos = await queryRunner.query(`SELECT id, slug FROM products`);

    // Inserir imagens para cada produto
    for (const produto of produtos) {
      await queryRunner.query(`
        INSERT INTO product_images (id, url, alt, \`order\`, product_id, created_at, updated_at)
        VALUES 
          (UUID(), '/images/produtos/${produto.slug}-1.jpg', '${produto.slug} - Imagem 1', 1, '${produto.id}', NOW(), NOW()),
          (UUID(), '/images/produtos/${produto.slug}-2.jpg', '${produto.slug} - Imagem 2', 2, '${produto.id}', NOW(), NOW()),
          (UUID(), '/images/produtos/${produto.slug}-3.jpg', '${produto.slug} - Imagem 3', 3, '${produto.id}', NOW(), NOW())
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover imagens
    await queryRunner.query(`DELETE FROM product_images`);
    // Remover produtos
    await queryRunner.query(`DELETE FROM products`);
    // Remover categorias
    await queryRunner.query(`DELETE FROM categories`);
  }
} 