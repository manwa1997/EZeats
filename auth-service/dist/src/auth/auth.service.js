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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entities/user.entity");
const constants_1 = require("./constants");
const cache_manager_1 = require("@nestjs/cache-manager");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, cache) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.cache = cache;
    }
    register(registerDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, firstName, lastName } = registerDto;
            // Check if the username or email already exists
            const existingUser = yield this.userRepository.findOne({
                where: [{ username }, { email }],
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Username or email already exists');
            }
            // Hash password
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            // Create and save user
            const newUser = this.userRepository.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
            });
            yield this.userRepository.save(newUser);
            return { message: 'User registered successfully' };
        });
    }
    login(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = loginDto;
            // First, check if the user data is in cache
            let userCache = yield this.cache.get(`user:${username}`);
            if (!userCache) {
                // If the user data is not in cache, fetch it from the database, including the password
                userCache = yield this.userRepository.findOne({
                    where: { username },
                    select: ['id', 'username', 'password'], // Include password here for comparison
                });
                if (!userCache) {
                    throw new common_1.UnauthorizedException('Invalid credentials');
                }
                // Cache the user data (excluding password) for future lookups
                const cacheData = {
                    id: userCache.id,
                    username: userCache.username,
                };
                yield this.cache.set(`user:${username}`, cacheData, 3600); // ttl is directly passed as a number (1 hour)
            }
            // Since we don't cache the password, we fetch it again from the database to compare it
            const user = yield this.userRepository.findOne({
                where: { id: userCache.id },
                select: ['id', 'username', 'password'], // Ensure we fetch the password as well
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            // Check password validity by comparing the hashed password
            if (!(yield bcrypt.compare(password, user.password))) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { sub: user.id, username: user.username };
            // Generate the access token
            const accessToken = this.jwtService.sign(payload, { secret: constants_1.jwtConstants.secret, expiresIn: constants_1.jwtConstants.expiresIn });
            // Generate the refresh token
            const refreshToken = this.jwtService.sign(payload, { secret: constants_1.jwtConstants.refreshSecret, expiresIn: constants_1.jwtConstants.refreshExpiresIn });
            return {
                accessToken,
                refreshToken,
            };
        });
    }
    verifyRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.jwtService.verify(refreshToken, { secret: constants_1.jwtConstants.refreshSecret });
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
        });
    }
    // Method to generate new access token
    generateAccessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jwtService.sign(payload, { secret: constants_1.jwtConstants.secret, expiresIn: constants_1.jwtConstants.expiresIn });
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService, Object])
], AuthService);
