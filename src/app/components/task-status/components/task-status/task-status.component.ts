import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { tap } from 'rxjs/operators';


import { TaskStatusData } from '../../../../data';


@Component({
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatButtonModule,

    FsFormModule,
    FsSkeletonModule,
    FsDialogModule,
    FsColorPickerModule,
  ],
})
export class TaskStatusComponent implements OnInit {

  public taskStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskStatus: any },
    private _dialogRef: MatDialogRef<TaskStatusComponent>,
    private _message: FsMessage,
    private _taskStatusData: TaskStatusData,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    if (this.data.taskStatus.id) {
      this._taskStatusData
        .get(this.data.taskStatus.id)
        .subscribe((taskStatus) => {
          this.taskStatus = taskStatus;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskStatus = this.data.taskStatus;
    }
  }

  public save = () => {
    return this._taskStatusData.save(this.taskStatus)
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          this.close(response);
        }),
      );
  };

  public close(data: any = null): void {
    this._dialogRef.close(data);
  }

}
