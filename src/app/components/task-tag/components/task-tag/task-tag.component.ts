import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs/operators';

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

  private _taskTagData: TaskTagData;  
  private _dialogRef = inject(MatDialogRef<TaskTagComponent>);
  private _data = inject<{ taskTag: any, taskTagData: TaskTagData }>(MAT_DIALOG_DATA);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this._taskTagData = this._data.taskTagData;
    if (this._data.taskTag.id) {
      this._taskTagData
        .get(this._data.taskTag.id)
        .subscribe((taskTag) => {
          this.taskTag = taskTag;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskTag = this._data.taskTag;
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
