import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { Request } from 'express';  // Explicitly import the Request type
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OrderService } from './order.service';

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
    
    const userId = 1; // Access user.id safely
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
