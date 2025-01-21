import { TaskConfig } from './task-config';

export interface TasksConfig {
  taskRouterLink?: any[];
  showCreate?: boolean;
  subjectObject?: {
    show?: boolean;
    label?: string;
  },
  taskConfig?: TaskConfig;
}
