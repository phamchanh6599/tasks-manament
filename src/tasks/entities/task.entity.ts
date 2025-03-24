import { TaskStatus } from '@/common/enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Implement User Authentication' })
  title: string;

  @ApiProperty({
    example: 'Add JWT authentication with refresh tokens',
    required: false,
  })
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  parentId?: string;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}
