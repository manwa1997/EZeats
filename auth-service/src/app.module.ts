import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../config/db.config'; 
import { User } from './auth/entities/user.entity';
import { ThrottlerMiddleware } from './common/middleware/throttler.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User],  
      synchronize: true,  
    }), CacheModule.register({
      store: redisStore,
      host: 'localhost',  // redis server address
      port: 6379,         // redis port
    }),
    AuthModule,  
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the ThrottlerMiddleware globally
    consumer.apply(ThrottlerMiddleware).forRoutes('*'); // for all routes
  }
}
