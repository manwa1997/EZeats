"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("./entities/user.entity"); // Assuming you have a User entity
const db_config_1 = require("../../config/db.config"); // Import the database config
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres', // You can replace this with your DB type (MySQL, SQLite, etc.)
                host: db_config_1.dbConfig.host,
                port: db_config_1.dbConfig.port,
                username: db_config_1.dbConfig.user,
                password: db_config_1.dbConfig.password,
                database: db_config_1.dbConfig.database,
                entities: [user_entity_1.User], // Register your entities (e.g., User entity)
                synchronize: true, // Make sure to set it to false in production
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]), // Register entities here
        ],
        providers: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
