import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_TASKS_DEFAULT_CONFIG } from '../injectors';
import { TasksConfig } from '../interfaces';


@NgModule({
})
export class FsTasksModule {
  public static forRoot(config: TasksConfig = {}): ModuleWithProviders<FsTasksModule> {
    return {
      ngModule: FsTasksModule,
      providers: [
        { provide: FS_TASKS_DEFAULT_CONFIG, useValue: config },
      ],
    };
  }
}
