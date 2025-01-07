import { InjectionToken } from '@angular/core';

import { TaskConfig } from '../interfaces';


export const FS_TASK_DEFAULT_CONFIG = new InjectionToken<TaskConfig>('fs-task-default-config');
