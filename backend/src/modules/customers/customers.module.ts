import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './controllers/customers.controller';
import { Customer } from './entities/customers.entity';
import { CustomersService } from './services/customers.service';
import { LoyaltyAccountsController } from './controllers/loyalty-accounts.controller';
import { LoyaltyAccount } from './entities/loyalty-accounts.entity';
import { LoyaltyAccountsService } from './services/loyalty-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, LoyaltyAccount])],
  controllers: [CustomersController, LoyaltyAccountsController],
  providers: [CustomersService, LoyaltyAccountsService],
})
export class CustomersModule {}


