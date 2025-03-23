import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseModule } from '@/config/supabase.module';
import { MailsModule } from '@/mails/mails.module';

@Module({
  imports: [SupabaseModule, MailsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
