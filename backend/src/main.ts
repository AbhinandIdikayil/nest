import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: 'http://localhost:5173', // Allow specific domain
    methods: 'GET,POST,PUT,DELETE', // Allow HTTP methods
    credentials: true, // Allow cookies to be sent
    allowedHeaders: 'Content-Type, Authorization', // Permitted request headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const firstMessage =
          errors
            .flatMap((error) => Object.values(error.constraints ?? {}))
            .find(Boolean) ?? 'Bad Request';

        return new BadRequestException(firstMessage);
      },
    }),
  );
  app.setGlobalPrefix('api');

  process.on('uncaughtException', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
