import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { UserRole } from "../entities/user.entity"; // Ajuste este caminho se necessário

export class AddUserRoleColumn1700000000002 implements MigrationInterface {
    name = 'AddUserRoleColumn1700000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "role",
            type: "enum",
            enum: [UserRole.ADMIN, UserRole.USER], 
            default: `'${UserRole.USER}'`,     // Valor padrão como string literal para SQL
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "role");
    }

} 