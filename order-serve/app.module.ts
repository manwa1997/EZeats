import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../order-serve/src/order/order.strategy';
import { OrderModule } from './src/order/order.module';
import { dbConfig } from '../shared/config/db.config';
import { Order } from '@shared/entities/order.entity';
import { User } from '@shared/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Ensure the environment variables are globally available
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, Order],  // Ensure User and Order entities are included here
      synchronize: true,  // Be cautious with this in production
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),

    OrderModule,  // Ensure that OrderModule is imported here
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
