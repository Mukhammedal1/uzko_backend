import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { SmsClientService } from './sms.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SmsClientService],
  exports: [SmsClientService],
})
export class SmsClientModule {}
