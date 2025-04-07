import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { DataSource } from 'typeorm';  

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,  
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.validateOrder(createOrderDto);

    const isStockAvailable = await this.checkStockAvailability(createOrderDto.item, createOrderDto.quantity);
    if (!isStockAvailable) {
      throw new BadRequestException('Not enough stock available for the item');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const order = this.orderRepository.create({
        ...createOrderDto,
        user,  
      });

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create the order');
    } finally {
      await queryRunner.release();
    }
  }

  //  method to validate order details
  private validateOrder(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.item || createOrderDto.item.trim().length === 0) {
      throw new BadRequestException('Item name cannot be empty');
    }

    if (createOrderDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }

    if (createOrderDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
  }
  private async checkStockAvailability(item: string, quantity: number): Promise<boolean> {
    return true;  // Assume stock is available for the sake of simplicity
  }
}
