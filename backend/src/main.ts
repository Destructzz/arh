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
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
