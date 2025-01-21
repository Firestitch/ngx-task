import { TaskStatus } from './task-status';
import { TaskWorkflowPath } from './task-workflow-path';

export interface TaskWorkflowStep {
  sourceTaskWorkflowPaths?: TaskWorkflowPath[];
  state?: string;
  taskStatus?: TaskStatus;
  taskStatusId?: number;
  taskWorkflowId?: number;
  id?: number;
  x1?: number;
  y1?: number;
}
