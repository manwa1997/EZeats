import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from '@shared/entities/order.entity';
import { User } from '@shared/entities/user.entity';
import { dbConfig } from '@shared/config/db.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './order/order.strategy';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true, // Make sure environment variables are globally accessible
    }),

    // Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, Order],
      synchronize: true, // Be careful with 'synchronize' in production
    }),

    // Passport Module for handling authentication
    PassportModule.register({ defaultStrategy: 'jwt' }), // Ensure jwt strategy is default

    // JWT Authentication Module
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from environment
        signOptions: { expiresIn: '1h' }, // Optional expiration time for JWT tokens
      }),
      inject: [ConfigService],
    }),

    // Import OrderModule where you define the controllers and services related to orders
    OrderModule,
  ],
  providers: [JwtStrategy], // Register JwtStrategy here

})
export class AppModule {}
