import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Order API')
    .setDescription('The Order API description')
    .setVersion('1.0')
    .addTag('orders')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/orders', app, document);  

  await app.listen(3001);
}
bootstrap();
