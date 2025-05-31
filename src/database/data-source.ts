import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from './entities/product.entity';
import { AddUserFields1710000000000 } from './migrations/1710000000000-AddUserFields';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'maria_francine',
  entities: [User, Order, OrderItem, Product],
  migrations: [AddUserFields1710000000000],
  synchronize: false, // Desativar sincronização automática em produção
  logging: process.env.NODE_ENV !== 'production',
}); 