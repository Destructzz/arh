import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SeedService],
  imports : [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
