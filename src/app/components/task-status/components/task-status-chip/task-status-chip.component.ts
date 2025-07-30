import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';


@Component({
  selector: 'app-task-status-chip',
  templateUrl: './task-status-chip.component.html',
  styleUrls: ['./task-status-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipModule,
  ],
})
export class TaskStatusChipComponent {

  @Input() public taskStatus;
  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' = 'tiny';

}
