import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
