import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { TasksModule } from '@/tasks/tasks.module';
import { MailsModule } from './mails/mails.module';
import { SupabaseModule } from '@/config/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    SupabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    MailsModule,
  ],
})
export class AppModule {}
