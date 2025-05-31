import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingUserFields1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se as colunas já existem antes de adicionar
    const tableInfo = await queryRunner.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
    `);

    const existingColumns = tableInfo.map((col: any) => col.COLUMN_NAME);

    // Adicionar colunas que não existem
    if (!existingColumns.includes('cpf')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN cpf VARCHAR(14) NULL`);
    }
    if (!existingColumns.includes('phone')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(15) NULL`);
    }
    if (!existingColumns.includes('country')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN country VARCHAR(2) NULL`);
    }
    if (!existingColumns.includes('zip_code')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN zip_code VARCHAR(9) NULL`);
    }
    if (!existingColumns.includes('street')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN street VARCHAR(255) NULL`);
    }
    if (!existingColumns.includes('number')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN number VARCHAR(10) NULL`);
    }
    if (!existingColumns.includes('complement')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN complement VARCHAR(100) NULL`);
    }
    if (!existingColumns.includes('neighborhood')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN neighborhood VARCHAR(100) NULL`);
    }
    if (!existingColumns.includes('city')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL`);
    }
    if (!existingColumns.includes('state')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN state VARCHAR(2) NULL`);
    }
    if (!existingColumns.includes('address_name')) {
      await queryRunner.query(`ALTER TABLE users ADD COLUMN address_name VARCHAR(50) NULL`);
    }

    // Verificar se o índice já existe
    const indexes = await queryRunner.query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND INDEX_NAME = 'idx_users_cpf'
    `);

    if (indexes.length === 0) {
      await queryRunner.query(`CREATE UNIQUE INDEX idx_users_cpf ON users (cpf)`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_cpf ON users`);

    // Remover colunas
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS address_name`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS state`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS city`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS neighborhood`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS complement`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS number`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS street`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS zip_code`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS country`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS phone`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS cpf`);
  }
} 