import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsIconPickerModule } from '@firestitch/icon-picker';

import { tap } from 'rxjs/operators';

import { TaskTypeData } from '../../../../data';


@Component({
  templateUrl: './task-type.component.html',
  styleUrls: ['./task-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    FsDialogModule,
    FsColorPickerModule,
    FsIconPickerModule,
    FsSkeletonModule,
    FsFormModule,
  ],
})
export class TaskTypeComponent implements OnInit {

  public taskType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskType: any },
    private _dialogRef: MatDialogRef<TaskTypeComponent>,
    private _message: FsMessage,
    private _taskTypeData: TaskTypeData,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    if (this.data.taskType.id) {
      this._taskTypeData
        .get(this.data.taskType.id)
        .subscribe((taskType) => {
          this.taskType = taskType;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskType = this.data.taskType;
    }
  }

  public save = () => {
    return this._taskTypeData.save(this.taskType)
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
