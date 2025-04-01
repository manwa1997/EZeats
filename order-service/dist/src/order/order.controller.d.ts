import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { Request } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(createOrderDto: CreateOrderDto, req: Request): Promise<import("../../../shared/entities/order.entity").Order>;
}
