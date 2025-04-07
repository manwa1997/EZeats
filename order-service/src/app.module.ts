import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from '../src/order/entities/order.entity';
import { User } from '../src/order/entities/user.entity';
import { dbConfig } from './order/config/db.config';  
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './order/order.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './order/guards/jwt-auth.guard';

@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, Order],
      synchronize: true, 
    }),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    OrderModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  JwtStrategy],

})
export class AppModule {}
