import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '@/config/supabase.config';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Role } from '@/common/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .insert({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        user_id: createTaskDto.userId,
        ...(createTaskDto.parentId && { parent_id: createTaskDto.parentId }),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapToTaskEntity(data);
  }

  async findAll(userId: string, userRole: string): Promise<Task[]> {
    let query = this.supabaseService.client.from('tasks').select('*');

    // If not admin, only show tasks assigned to the user
    if (userRole !== Role.ADMIN) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data.map(this.mapToTaskEntity);
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Task> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has access to this task
    if (userRole !== Role.ADMIN && data.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return this.mapToTaskEntity(data);
  }

  async findSubtasks(
    taskId: string,
    userId: string,
    userRole: string,
  ): Promise<Task[]> {
    // First check if the parent task exists and user has access to it
    await this.findOne(taskId, userId, userRole);

    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .select('*')
      .eq('parent_id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    // Filter subtasks if user is not admin
    if (userRole !== Role.ADMIN) {
      return data
        .filter((task) => task.user_id === userId)
        .map(this.mapToTaskEntity);
    }

    return data.map(this.mapToTaskEntity);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { data, error } = await this.supabaseService.client
      .from('tasks')
      .update({
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        user_id: updateTaskDto.userId,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new NotFoundException('Task not found');
    }

    return this.mapToTaskEntity(data);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  private mapToTaskEntity(data: any): Task {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      userId: data.user_id,
      parentId: data.parent_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
