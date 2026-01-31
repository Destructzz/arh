import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProcurementModule } from './modules/procurement/procurement.module';

@Module({
  imports: [
    DatabaseModule,
    CatalogModule,
    CustomersModule,
    OrdersModule,
    InventoryModule,
    ProcurementModule,
    DiscountsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
