import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_price: number;

  @Column({ default: false })
  on_sale: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column('int')
  stock_quantity: number;

  @Column('json')
  sizes: string[];

  @Column('json')
  colors: string[];

  @Column('json', { nullable: true })
  tags: string[];

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: number;

  @OneToMany(() => ProductImage, (image: ProductImage) => image.product)
  images: ProductImage[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  order_items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 