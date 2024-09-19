import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
    bodyParser: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints![Object.keys(error.constraints!)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  app.setGlobalPrefix("/api/v1");

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription('The Employee Management API documentation')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer Auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

bootstrap();
