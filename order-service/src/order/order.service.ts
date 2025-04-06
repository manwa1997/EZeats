import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dtos/CreateOrderDto';

@Injectable()
export class OrderService {
  // Change the visibility from private to public (or protected)
  public orderRepository: Repository<Order>;
  public userRepository: Repository<User>;

  constructor(
    @InjectRepository(Order) orderRepository: Repository<Order>,
    @InjectRepository(User) userRepository: Repository<User>
  ) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
  }

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
