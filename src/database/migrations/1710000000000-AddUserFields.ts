import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar novas colunas (MySQL não aceita IF NOT EXISTS)
    await queryRunner.query(`ALTER TABLE users ADD COLUMN cpf VARCHAR(14) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(15) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN country VARCHAR(2) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN zip_code VARCHAR(9) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN street VARCHAR(255) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN number VARCHAR(10) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN complement VARCHAR(100) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN neighborhood VARCHAR(100) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN state VARCHAR(2) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN address_name VARCHAR(50) NULL`);

    // Adicionar índice único para CPF
    await queryRunner.query(`CREATE UNIQUE INDEX idx_users_cpf ON users (cpf)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`DROP INDEX idx_users_cpf ON users`);

    // Remover colunas (um por vez)
    await queryRunner.query(`ALTER TABLE users DROP COLUMN address_name`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN state`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN city`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN neighborhood`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN complement`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN number`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN street`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN zip_code`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN country`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN phone`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN cpf`);
  }
} 