import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsBadgeModule } from '@firestitch/badge';


@Component({
  selector: 'app-task-assigned-account-chip',
  templateUrl: './task-assigned-account-chip.component.html',
  styleUrls: ['./task-assigned-account-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsBadgeModule,
  ],
})
export class TaskAssignedAccountChipComponent {

  @Input() public assignedAccount;

}
