import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsColorPickerModule, randomColor } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsIconPickerModule } from '@firestitch/icon-picker';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { tap } from 'rxjs/operators';

import { TaskTypeData, TaskWorkflowData } from '../../../../data';
import { TaskType, TaskWorkflow } from '../../../../interfaces';
import { TaskWorkflowManageDialogComponent } from '../../../workflow/components/task-workflow-manage-dialog/task-workflow-manage-dialog.component';


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

    FsAutocompleteChipsModule,
    FsDialogModule,
    FsColorPickerModule,
    FsIconPickerModule,
    FsSkeletonModule,
    FsFormModule,
  ],
})
export class TaskTypeComponent implements OnInit {

  public taskType: TaskType;
  public taskWorkflows: TaskWorkflow[] = [];

  private _taskTypeData = inject(TaskTypeData);
  private _dialogRef = inject(MatDialogRef<TaskTypeComponent>);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);   
  private _taskWorkflowData = inject(TaskWorkflowData);
  private _dialog = inject(MatDialog);
  private _data = inject<{ 
    taskType: any, 
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this._data.taskType.id) {
      this._taskTypeData
        .get(this._data.taskType.id, {
          taskWorkflow: true,
        })
        .subscribe((taskType) => {
          this.taskType = taskType;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskType = {
        ...this._data.taskType,
        color: randomColor(),
      };
    }
  }

  public fetchTaskWorkflows = (keyword: string) => {
    return this._taskWorkflowData.gets(keyword);
  };
  
  public manageTaskWorkflows() {
    this._dialog.open(TaskWorkflowManageDialogComponent);
  }

  public save = () => {
    return this._taskTypeData
      .save(this.taskType)
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
