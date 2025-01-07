import { InjectionToken } from '@angular/core';

import { TasksConfig } from '../interfaces';


export const FS_TASKS_CONFIG = new InjectionToken<TasksConfig>('fs-tasks-config');
