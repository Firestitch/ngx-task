import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';

import { ManageFieldsComponent } from '../manage-fields.component';


@Component({
  templateUrl: './manage-fields-dialog.component.html',
  styleUrls: ['./manage-fields-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    
    FsDialogModule,
    ManageFieldsComponent,
  ],
})
export class ManageFieldsDialogComponent {

}
