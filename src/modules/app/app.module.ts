import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { TIMEOUT } from '@constants';
import { DatabaseModule } from '@infrastructure';
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
  ],
})
export class AppModule {}
