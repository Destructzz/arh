import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiscountsController } from './controllers/discounts.controller';
import { Discount } from './entities/discounts.entity';
import { DiscountsService } from './services/discounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}


