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
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const db_config_1 = require("../config/db.config");
const user_entity_1 = require("./auth/entities/user.entity");
const throttler_middleware_1 = require("./common/middleware/throttler.middleware");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
let AppModule = class AppModule {
    configure(consumer) {
        // Apply the ThrottlerMiddleware globally
        consumer.apply(throttler_middleware_1.ThrottlerMiddleware).forRoutes('*'); // Apply to all routes
    }
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
                entities: [user_entity_1.User],
                synchronize: true,
            }), cache_manager_1.CacheModule.register({
                store: cache_manager_redis_store_1.redisStore,
                host: 'localhost', // Redis server address
                port: 6379, // Redis port
            }),
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
