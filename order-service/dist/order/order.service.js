"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
let OrderService = class OrderService {
    constructor(orderRepository, userRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    createOrder(createOrderDto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            this.validateOrder(createOrderDto);
            const isStockAvailable = yield this.checkStockAvailability(createOrderDto.item, createOrderDto.quantity);
            if (!isStockAvailable) {
                throw new common_1.BadRequestException('Not enough stock available for the item');
            }
            // Start a transaction using the injected DataSource
            const queryRunner = this.dataSource.createQueryRunner();
            yield queryRunner.startTransaction();
            try {
                const order = this.orderRepository.create(Object.assign(Object.assign({}, createOrderDto), { user }));
                yield queryRunner.manager.save(order);
                yield queryRunner.commitTransaction();
                return order;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.BadRequestException('Failed to create the order');
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    // Helper method to validate order details
    validateOrder(createOrderDto) {
        if (!createOrderDto.item || createOrderDto.item.trim().length === 0) {
            throw new common_1.BadRequestException('Item name cannot be empty');
        }
        if (createOrderDto.price <= 0) {
            throw new common_1.BadRequestException('Price must be greater than zero');
        }
        if (createOrderDto.quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than zero');
        }
    }
    checkStockAvailability(item, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return true; // Assume stock is available for the sake of simplicity
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_3.DataSource])
], OrderService);
