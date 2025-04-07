import { Order } from './order.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    orders: Order[];
}
