import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Implement User Authentication',
        description: 'Add JWT authentication with refresh tokens',
        status: 'pending',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        parentId: null,
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
      },
    },
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tasks assigned to the user' })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: [Task],
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Implement User Authentication',
          description: 'Add JWT authentication with refresh tokens',
          status: 'pending',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          parentId: null,
          createdAt: '2024-03-20T10:00:00Z',
          updatedAt: '2024-03-20T10:00:00Z',
        },
      ],
    },
  })
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: Task,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Implement User Authentication',
        description: 'Add JWT authentication with refresh tokens',
        status: 'pending',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        parentId: null,
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
      },
    },
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(id, req.user.userId, req.user.role);
  }

  @Get(':id/subtasks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subtasks of a specific task' })
  @ApiParam({
    name: 'id',
    description: 'Parent Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Subtasks retrieved successfully',
    type: [Task],
    schema: {
      example: [
        {
          id: '987fcdeb-51k2-12d3-a456-426614174000',
          title: 'Implement Refresh Token Logic',
          description: 'Create refresh token rotation mechanism',
          status: 'in_progress',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          parentId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2024-03-20T10:30:00Z',
          updatedAt: '2024-03-20T10:30:00Z',
        },
      ],
    },
  })
  findSubtasks(@Param('id') id: string, @Req() req) {
    return this.tasksService.findSubtasks(id, req.user.userId, req.user.role);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a task (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Implement User Authentication',
        description:
          'Add JWT authentication with refresh tokens and email verification',
        status: 'in_progress',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        parentId: null,
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T11:00:00Z',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a task (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Task ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
