import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { TIMEOUT } from '@constants';
import { DatabaseModule, RedisModule } from '@infrastructure';
import { BusinessesModule } from 'modules/businesses';
import { CurrencyModule } from 'modules/currency';
import { CustomersModule } from 'modules/customers';
import { ModulesModule } from 'modules/modules';
import { UsersModule } from 'modules/users';
import { PagesModule } from 'modules/pages';
import { UserPermissionsModule } from 'modules/user-permissions';
import { AuthModule } from 'modules/auth';
import { AgentsModule } from 'modules/agents';
import { MailModule } from 'modules/mail';
import { BusinessEmployeeeModule } from 'modules/business-employee';
import { AdminModule } from 'modules/admin';
import { SalesModule } from 'modules/sales';
import { CustomerDebtsModule } from 'modules/customer-debts';
import { FilesModule } from 'modules/files';
import { UnitsModule } from 'modules/units/units.module';
import { StocksModule } from 'modules/stocks';
import { SuppliersModule } from 'modules/suppliers';
import { ShelfNumbersModule } from 'modules/shelf_numbers';
import { PermissionsModule } from 'modules/permissions';
import { ProductsModule } from 'modules/products';
import { ExpenseTypesModule } from 'modules/expense-types';
import { BusinessCurrencyModule } from 'modules/business-currency';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: TIMEOUT,
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }),
    }),
    DatabaseModule,
    BusinessesModule,
    CurrencyModule,
    UsersModule,
    CustomersModule,
    ModulesModule,
    PagesModule,
    UserPermissionsModule,
    AuthModule,
    AgentsModule,
    MailModule,
    BusinessEmployeeeModule,
    AdminModule,
    SalesModule,
    CustomerDebtsModule,
    FilesModule,
    UnitsModule,
    StocksModule,
    SuppliersModule,
    ShelfNumbersModule,
    RedisModule,
    PermissionsModule,
    ProductsModule,
    ExpenseTypesModule,
    BusinessCurrencyModule,
  ],
})
export class AppModule {}
