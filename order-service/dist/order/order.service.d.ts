import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { User } from '@shared/entities/user.entity';
import { Order } from '@shared/entities/order.entity';
export declare class OrderService {
    private readonly orderRepository;
    private readonly userRepository;
    constructor(orderRepository: Repository<Order>, userRepository: Repository<User>);
    createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order>;
}
