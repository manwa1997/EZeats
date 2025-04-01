import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity'; // Ensure correct import
import { JwtStrategy } from './order.strategy';  // Import JwtStrategy
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../../../shared/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order]),  // Make sure to add User here
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtStrategy],  // Add JwtStrategy here
})
export class OrderModule {}
