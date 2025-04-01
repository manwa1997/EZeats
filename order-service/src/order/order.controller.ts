import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';  // Import Request for type definition

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = req.user.id;
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
