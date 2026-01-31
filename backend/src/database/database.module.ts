import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), '../.env'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'postgres'),
        password: configService.get<string>('POSTGRES_PASSWORD', ''),
        database: configService.get<string>('POSTGRES_DB', 'postgres'),
        entities: [resolve(__dirname, '../modules/**/*.entity.{ts,js}')],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
