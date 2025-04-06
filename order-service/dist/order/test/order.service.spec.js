"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const order_service_1 = require("../order.service");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const mockOrder = {
    id: 1,
    item: 'Item 1',
    price: 100.0,
    quantity: 2,
    user: { id: 1, email: 'user@example.com' }, // The user linked to the order
};
const mockUser = { id: 1, email: 'user@example.com' };
describe('OrderService', () => {
    let service;
    let orderRepository;
    let userRepository;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                order_service_1.OrderService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(order_entity_1.Order),
                    useClass: typeorm_2.Repository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useClass: typeorm_2.Repository,
                },
            ],
        }).compile();
        service = module.get(order_service_1.OrderService);
        orderRepository = module.get((0, typeorm_1.getRepositoryToken)(order_entity_1.Order));
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createOrder', () => {
        it('should create an order and associate it with a user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Simulate user being found
            jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder);
            jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder);
            const result = yield service.createOrder({ item: 'Item 1', price: 100.0, quantity: 2, userId: 1 }, // Passing the order data
            1 // Simulating the user ID
            );
            expect(result).toEqual(mockOrder);
            expect(orderRepository.save).toHaveBeenCalled();
        }));
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            yield expect(service.createOrder({ item: 'Item 1', price: 100.0, quantity: 2, userId: 1 }, 1)).rejects.toThrowError(new common_1.NotFoundException('User not found'));
        }));
    });
});
