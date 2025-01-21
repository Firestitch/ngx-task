import { ChangeDetectionStrategy, Component } from '@angular/core';

import { of } from 'rxjs';

import { TasksConfig } from '../../../../src/public_api';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {

  public config: TasksConfig = {
    taskConfig: {
      subjectObject: {
        show: true,
        label: 'Client',
        select: (keywords: string[]) => {
          return of([{
            name: 'Bobby',
            id: 1,
          }, {
            name: 'Willy',
            id: 2,
          }]);
        },
        change: (task: Task, object: object) => {
          return of({
            ...task,
            subjectObject: object,
          });
        },
        click: (task: Task, object: object) => {
          console.log(task, object);
        },
      },
    },
  };

}
