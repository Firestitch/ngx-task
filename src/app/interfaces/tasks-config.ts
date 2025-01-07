import { TaskConfig } from './task-config';

export interface TasksConfig {
  taskRouterLink?: any[];
  showSubjectObject?: boolean;
  showCreate?: boolean;
  subjectObjectName?: string;
  taskConfig?: TaskConfig;
}
