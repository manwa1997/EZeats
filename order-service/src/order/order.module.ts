import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { User } from '../order/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtStrategy } from './order.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Order]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class OrderModule {}
