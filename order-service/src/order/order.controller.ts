import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../order/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../order/dtos/CreateOrderDto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user as { userId: number };

    if (!user || !user.userId) {
      throw new Error('Unauthorized access: user not found');
    }

    return this.orderService.createOrder(createOrderDto, user.userId);
  }
}
