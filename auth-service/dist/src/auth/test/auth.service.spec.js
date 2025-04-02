"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const auth_service_1 = require("../auth.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../entities/user.entity");
jest.mock('bcryptjs');
describe('AuthService', () => {
    let authService;
    let userRepoMock;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                jwt_1.JwtService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        userRepoMock = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    }));
    describe('register', () => {
        it('should create a new user and save it', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                username: 'testUser',
                email: 'test@example.com',
                password: 'rawPassword',
                firstName: 'manwa',
                lastName: 'rabaya',
            };
            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);
            userRepoMock.findOne.mockResolvedValue(null); // No existing user
            userRepoMock.create.mockImplementation((data) => (Object.assign(Object.assign({}, data), { id: 1 })));
            userRepoMock.save.mockResolvedValue(Object.assign(Object.assign({}, newUser), { password: hashedPassword, id: 1 }));
            const result = yield authService.register(newUser);
            expect(result).toEqual({ message: 'User registered successfully' });
            expect(userRepoMock.create).toHaveBeenCalledWith(Object.assign(Object.assign({}, newUser), { password: hashedPassword }));
            expect(userRepoMock.save).toHaveBeenCalled();
        }));
    });
    describe('login', () => {
        it('should throw an error if credentials are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = { username: 'testUser', password: 'wrongPassword' };
            userRepoMock.findOne.mockResolvedValue({
                id: 1,
                username: 'testUser',
                email: 'test@example.com',
                password: 'hashedPassword123',
            });
            bcrypt.compare.mockResolvedValue(false);
            yield expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        }));
        it('should throw an error if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = { username: 'unknownUser', password: 'anyPassword' };
            userRepoMock.findOne.mockResolvedValue(null); // User not found
            yield expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        }));
    });
});
