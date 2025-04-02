import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';  
import { RegisterDto } from './dto/register.dto'; 
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // Group under 'Authentication' in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates a user and returns a JWT token.' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {  
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration', description: 'Registers a new user with hashed password.' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto) { 
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiBearerAuth() // Requires JWT token in Swagger
  @ApiOperation({ summary: 'Refresh access token', description: 'Generates a new access token using a refresh token.' })
  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const decoded = await this.authService.verifyRefreshToken(refreshToken); // Use the service to verify the refresh token
      const payload = { sub: decoded.sub, username: decoded.username };
      return { accessToken: await this.authService.generateAccessToken(payload) }; // Generate new access token using service
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}
