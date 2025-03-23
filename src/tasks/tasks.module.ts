import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SupabaseModule } from '@/config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
