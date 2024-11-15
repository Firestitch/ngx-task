import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-task-type-chip',
  templateUrl: './task-type-chip.component.html',
  styleUrls: ['./task-type-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    
    MatIconModule,
  ],
})
export class TaskTypeChipComponent {

  @Input() public taskType;

}
