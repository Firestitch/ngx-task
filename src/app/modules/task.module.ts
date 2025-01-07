import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_TASK_DEFAULT_CONFIG } from '../injectors/task-default-config.injector';
import { TaskConfig } from '../interfaces';


@NgModule({
})
export class FsTaskModule {
  public static forRoot(config: TaskConfig = {}): ModuleWithProviders<FsTaskModule> {
    return {
      ngModule: FsTaskModule,
      providers: [
        { provide: FS_TASK_DEFAULT_CONFIG, useValue: config },
      ],
    };
  }
}
