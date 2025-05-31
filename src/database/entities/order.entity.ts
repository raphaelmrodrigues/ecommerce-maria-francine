import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDENTE',
  PROCESSING = 'PROCESSANDO',
  SHIPPED = 'ENVIADO',
  DELIVERED = 'ENTREGUE',
  CANCELED = 'CANCELADO',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' }) // Se o usuário for deletado, seus pedidos também são.
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn() // Usaremos o created_at como data do pedido
  order_date: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'text' })
  shipping_address: string;

  // Poderia ter um billing_address separado se necessário

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true, eager: true })
  items: OrderItem[];

  @UpdateDateColumn()
  updated_at: Date;
} 