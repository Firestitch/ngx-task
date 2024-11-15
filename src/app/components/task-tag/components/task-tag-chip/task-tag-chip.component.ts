import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';


@Component({
  selector: 'app-task-tag-chip',
  templateUrl: './task-tag-chip.component.html',
  styleUrls: ['./task-tag-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    
    FsChipModule,
  ],
})
export class TaskTagChipComponent {

  @Input() public taskTag;
  @Input() public size = 'tiny';

}
