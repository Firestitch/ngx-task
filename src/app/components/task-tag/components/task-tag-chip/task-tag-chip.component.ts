import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';


@Component({
  selector: 'fs-task-tag-chip',
  templateUrl: './task-tag-chip.component.html',
  styleUrls: ['./task-tag-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    
    FsChipModule,
  ],
})
export class FsTaskTagChipComponent {

  @Input() public taskTag;
  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' = 'tiny';

}
