import { InjectionToken } from '@angular/core';

import { TasksConfig } from '../interfaces';


export const FS_TASKS_DEFAULT_CONFIG = new InjectionToken<TasksConfig>('fs-tasks-default-config');
