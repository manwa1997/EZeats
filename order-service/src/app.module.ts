import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from '@shared/entities/order.entity';
import { User } from '@shared/entities/user.entity';
import { dbConfig } from '@shared/config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User,Order],  
      synchronize: true,  
    }),
    OrderModule,  
  ],
})
export class AppModule {}