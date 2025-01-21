import { TaskWorkflow } from './task-workflow';

export interface TaskType {
  color?: string;
  default?: boolean;
  environmentId?: number;
  icon?: string;
  name?: string;
  order?: number;
  state?: string;
  id?: number;
  taskWorkflowId?: number;
  taskWorkflow?: TaskWorkflow;
}
