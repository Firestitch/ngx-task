import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { TaskTagData } from '../../../../data';


@Component({
  templateUrl: './task-tag.component.html',
  styleUrls: ['./task-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,

    FsDialogModule,
    FsFormModule,
    FsColorPickerModule,
  ],
})
export class TaskTagComponent implements OnInit {

  public taskTag;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskTag: any },
    private _dialogRef: MatDialogRef<TaskTagComponent>,
    private _message: FsMessage,
    private _taskTagData: TaskTagData,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    if (this.data.taskTag.id) {
      this._taskTagData
        .get(this.data.taskTag.id)
        .subscribe((taskTag) => {
          this.taskTag = taskTag;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskTag = this.data.taskTag;
    }
  }

  public save = () => {
    return this._taskTagData.save(this.taskTag)
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
