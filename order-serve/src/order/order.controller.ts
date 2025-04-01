import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user;
    console.log("user");
    if (!user) {
      throw new Error('Unauthorized access: user not found');
    }

    const userId = 1;
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
