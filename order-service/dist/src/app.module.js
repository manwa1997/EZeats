"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const db_config_1 = require("@shared/config/db.config");
const order_entity_1 = require("@shared/entities/order.entity");
const user_entity_1 = require("@shared/entities/user.entity");
const order_module_1 = require("./order/order.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: db_config_1.dbConfig.host,
                port: db_config_1.dbConfig.port,
                username: db_config_1.dbConfig.user,
                password: db_config_1.dbConfig.password,
                database: db_config_1.dbConfig.database,
                entities: [user_entity_1.User, order_entity_1.Order],
                synchronize: true,
            }),
            order_module_1.OrderModule,
        ],
    })
], AppModule);
