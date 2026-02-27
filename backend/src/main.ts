import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('AIS Flower Shop API')
    .setDescription('MVP API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(cookieParser());

  // Custom middleware to log all endpoints
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const statusCode = res.statusCode;
      // You can adjust colors if you want, but simple text formatting works fine.
      console.log(`[HTTP] ${req.method} ${req.url} - ${statusCode} [${ms}ms]`);
    });
    next();
  });
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
