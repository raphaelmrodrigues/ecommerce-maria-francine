import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Remova (ou comente) as importações antigas:
// import { AddProductFilters1709123456789 } from '../database/migrations/1709123456789-AddProductFilters';
// import { InsertSampleData1709123456790 } from '../database/migrations/1709123456790-InsertSampleData';

import { AddUserFields1710000000000 } from '../database/migrations/1710000000000-AddUserFields';
import { AddMissingUserFields1710000000001 } from '../database/migrations/1710000000001-AddMissingUserFields';

const migrations = [
  // Remova (ou comente) as migrations antigas:
  // AddProductFilters1709123456789,
  // InsertSampleData1709123456790,
  AddUserFields1710000000000,
  AddMissingUserFields1710000000001
];

const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'ecommerce-maria-francine-desenv',
  entities: [join(__dirname, '..', 'database', 'entities', '*.entity{.ts,.js}')],
  migrations,
  migrationsRun: true,
  synchronize: false,
  logging: true,
  extra: {
    connectionLimit: 5
  }
};

console.log('Database config:', {
  host: options.host,
  port: options.port,
  database: options.database,
  migrationsCount: migrations.length
});

export const AppDataSource = new DataSource(options);

// Para compatibilidade com o NestJS
export default options; 