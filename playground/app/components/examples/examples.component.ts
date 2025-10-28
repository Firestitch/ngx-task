import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsExampleModule } from '@firestitch/example';
import { TasksComponent } from '../tasks/tasks.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsExampleModule, TasksComponent],
})
export class ExamplesComponent {
}
  
