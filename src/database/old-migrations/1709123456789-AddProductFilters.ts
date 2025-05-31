import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductFilters1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar colunas de filtro
    await queryRunner.query(`
      ALTER TABLE products
      ADD COLUMN sizes JSON NOT NULL,
      ADD COLUMN colors JSON NOT NULL,
      ADD COLUMN tags JSON NULL,
      ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN on_sale BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN sale_price DECIMAL(10,2) NULL;
    `);

    // Atualizar registros existentes com arrays vazios
    await queryRunner.query(`
      UPDATE products 
      SET sizes = '[]', colors = '[]'
      WHERE sizes IS NULL OR colors IS NULL;
    `);

    // Criar tabela de imagens de produtos
    await queryRunner.query(`
      CREATE TABLE product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        alt VARCHAR(255) NULL,
        \`order\` INT NOT NULL DEFAULT 0,
        product_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_product_images_product
          FOREIGN KEY (product_id)
          REFERENCES products (id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX idx_products_featured ON products (featured);
      CREATE INDEX idx_products_on_sale ON products (on_sale);
      CREATE INDEX idx_products_sale_price ON products (sale_price);
      CREATE INDEX idx_product_images_product_id ON product_images (product_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_products_featured ON products;
      DROP INDEX IF EXISTS idx_products_on_sale ON products;
      DROP INDEX IF EXISTS idx_products_sale_price ON products;
      DROP INDEX IF EXISTS idx_product_images_product_id ON product_images;
    `);

    // Remover tabela de imagens
    await queryRunner.query(`DROP TABLE IF EXISTS product_images;`);

    // Remover colunas de filtro
    await queryRunner.query(`
      ALTER TABLE products
      DROP COLUMN sizes,
      DROP COLUMN colors,
      DROP COLUMN tags,
      DROP COLUMN featured,
      DROP COLUMN on_sale,
      DROP COLUMN sale_price;
    `);
  }
} 