import { InjectionToken } from '@angular/core';

import { TaskConfig } from '../interfaces';


export const FS_TASK_CONFIG = new InjectionToken<TaskConfig>('fs-task-config');
