import { TaskFile } from './task-file';

export interface TaskComment {
  comment?: string;
  createAccountId?: number;
  createDate?: Date;
  modifyDate?: Date;
  state?: string;
  id?: number;
  taskFiles?: TaskFile[];
  taskId?: number;
}
