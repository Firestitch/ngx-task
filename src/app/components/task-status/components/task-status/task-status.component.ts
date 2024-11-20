import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

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

  private _taskStatusData: TaskStatusData;
  private _dialogRef = inject(MatDialogRef<TaskStatusComponent>);
  private _data = inject<{ taskStatus: any, taskStatusData: TaskStatusData }>(MAT_DIALOG_DATA);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef); 

  public ngOnInit(): void {
    this._taskStatusData = this._data.taskStatusData;
    if (this._data.taskStatus.id) {
      this._taskStatusData
        .get(this._data.taskStatus.id)
        .subscribe((taskStatus) => {
          this.taskStatus = taskStatus;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskStatus = this._data.taskStatus;
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
