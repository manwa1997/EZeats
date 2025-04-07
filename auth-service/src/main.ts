import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('EZeats Authentication API')
    .setDescription('API documentation for the authentication service')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // u can try http://localhost:3000/api-docs

  await app.listen(3000);
}

bootstrap();
