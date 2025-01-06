import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsBadgeModule } from '@firestitch/badge';

import { Account } from '../../../../interfaces';


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

  @Input() public assignedAccount: Account;
  @Input() public showTooltip: boolean = true;

}
