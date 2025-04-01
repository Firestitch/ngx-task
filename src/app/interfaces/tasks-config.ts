import { Observable } from 'rxjs';

import { Task } from './task';
import { TaskConfig } from './task-config';

export interface TasksConfig {
  taskRouterLink?: any[];
  create?: {
    show: boolean;
    data?: () => Observable<Task>;
  },
  subjectObject?: {
    show?: boolean;
    label?: string;
  },
  taskConfig?: TaskConfig;
}
