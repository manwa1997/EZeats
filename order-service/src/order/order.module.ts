import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/user.entity';
import { JwtStrategy } from './order.strategy'; // Import the JwtStrategy
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '@shared/entities/order.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Order]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtStrategy],
  exports: [JwtAuthGuard], // Ensure JwtStrategy is here
})
export class OrderModule {}
