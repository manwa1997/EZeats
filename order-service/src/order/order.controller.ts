import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../order/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../order/dtos/CreateOrderDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')  
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' }) 
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })  
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input.',
  }) 
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT token.',
  })  
  @ApiBearerAuth()  
  @ApiBody({ type: CreateOrderDto })  
  async create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user as { userId: number };

    if (!user || !user.userId) {
      throw new Error('Unauthorized access: user not found');
    }

    return this.orderService.createOrder(createOrderDto, user.userId);
  }
}
