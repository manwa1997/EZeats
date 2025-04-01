import { User } from './user.entity';
export declare class Order {
    id: number;
    user: User;
    item: string;
    price: number;
    quantity: number;
    status: string;
    constructor(partial: Partial<Order>);
}
