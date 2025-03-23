import { TaskStatus } from '@/common/enums/task-status.enum';

export class Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
