import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsBadgeModule } from '@firestitch/badge';
import { FsChipModule } from '@firestitch/chip';
import { index } from '@firestitch/common';

import { TaskPriorities } from '../../../../consts';


@Component({
  selector: 'app-priority-chip',
  templateUrl: './priority-chip.component.html',
  styleUrls: ['./priority-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    FsChipModule,
    FsBadgeModule,
  ],
})
export class PriorityChipComponent {

  @Input() public priority: number;
  @Input() public showLabel = false;

  public TaskPriorityNames = index(TaskPriorities, 'value', 'name');
  public TaskPriorityIcons = index(TaskPriorities, 'value', 'icon');
  public TaskPriorityColors = index(TaskPriorities, 'value', 'color');
  
}
