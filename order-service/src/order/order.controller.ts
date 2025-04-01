import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { JwtAuthGuard } from '../order/guards/jwt-auth.guard'
import { Request } from 'express';  // Explicitly import the Request type

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user; // Get the user object
    if (!user) {
      throw new Error('Unauthorized access: user not found');
    }
    
    const userId = user.id; // Access user.id safely
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
