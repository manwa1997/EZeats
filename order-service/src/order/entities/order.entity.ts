import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number; 

  @ManyToOne(() => User, (user) => user.orders, { eager: true, onDelete: 'CASCADE' })
  user!: User;

  @Column()
  item!: string;

  @Column('decimal')
  price!: number;

  @Column()
  quantity!: number;

  @Column({ default: 'pending' })
  status!: string;

  // Optional: Add a constructor for flexibility if needed
  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
