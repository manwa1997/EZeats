import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';  
import { Order } from '../entities/order.entity';  
import { User } from '../entities/user.entity';  
import { getRepositoryToken } from '@nestjs/typeorm';  
import { Repository } from 'typeorm'; 
import { NotFoundException } from '@nestjs/common';  


const mockOrder = {
    id: 1,
    item: 'Item 1',
    price: 100.0,
    quantity: 2,
    user: { id: 1, email: 'user@example.com' },  // The user linked to the order
};

const mockUser = { id: 1, email: 'user@example.com' }; 
describe('OrderService', () => {
    let service: OrderService;  
    let orderRepository: Repository<Order>;  
    let userRepository: Repository<User>;  

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,  
                {
                    provide: getRepositoryToken(Order),  
                    useClass: Repository,  
                },
                {
                    provide: getRepositoryToken(User),  
                    useClass: Repository,  
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create an order and associate it with a user', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);  // Simulate user being found
            jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder as any);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder as any);

            const result = await service.createOrder(
                { item: 'Item 1', price: 100.0, quantity: 2, userId: 1 },  // Passing the order data
                1  // Simulating the user ID
            );

            expect(result).toEqual(mockOrder);
            expect(orderRepository.save).toHaveBeenCalled();
        });

        it('should throw an error if the user is not found', async () => {

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(
                service.createOrder({ item: 'Item 1', price: 100.0, quantity: 2, userId: 1 }, 1)
            ).rejects.toThrowError(new NotFoundException('User not found'));
        });
    });
});
