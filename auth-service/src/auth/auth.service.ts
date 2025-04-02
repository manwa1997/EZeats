import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// Define the UserCacheInterface
interface UserCache {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,  // Explicitly inject the cache service
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, firstName, lastName } = registerDto;

    // Check if the username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await this.userRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
  
    // First, check if the user data is in cache
    let userCache = await this.cache.get<UserCache>(`user:${username}`);
  
    if (!userCache) {
      // If the user data is not in cache, fetch it from the database, including the password
      userCache = await this.userRepository.findOne({
        where: { username },
        select: ['id', 'username', 'password'], // Include password here for comparison
      });
  
      if (!userCache) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Cache the user data (excluding password) for future lookups
      const cacheData = {
        id: userCache.id,
        username: userCache.username,
      };
  
      await this.cache.set(`user:${username}`, cacheData, 3600); // ttl is directly passed as a number (1 hour)
    }
  
    // Since we don't cache the password, we fetch it again from the database to compare it
    const user = await this.userRepository.findOne({
      where: { id: userCache.id },
      select: ['id', 'username', 'password'], // Ensure we fetch the password as well
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Check password validity by comparing the hashed password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { sub: user.id, username: user.username };
  
    // Generate the access token
    const accessToken = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expiresIn });
  
    // Generate the refresh token
    const refreshToken = this.jwtService.sign(payload, { secret: jwtConstants.refreshSecret, expiresIn: jwtConstants.refreshExpiresIn });
  
    return {
      accessToken,
      refreshToken,
    };
  }
  

  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, { secret: jwtConstants.refreshSecret });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Method to generate new access token
  async generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expiresIn });
  }
}
