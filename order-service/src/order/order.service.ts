import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../../shared/entities/order.entity';
import { User } from '../../../shared/entities/user.entity';
import { CreateOrderDto } from './dtos/CreateOrderDto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the order and associate it with the user
    const order = this.orderRepository.create({
      ...createOrderDto,
      user: user,  // Associate user with the order
    });

    return this.orderRepository.save(order);  // Save the order to the database
  }
}
