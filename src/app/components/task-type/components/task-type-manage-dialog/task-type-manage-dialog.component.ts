import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListConfig } from '@firestitch/list';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


import { FsTaskTypeManageComponent } from '../task-type-manage/task-type-manage.component';


@Component({
  templateUrl: './task-type-manage-dialog.component.html',
  styleUrls: ['./task-type-manage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatDialogModule,
    MatButtonModule,

    FsDialogModule,
    FsFormModule,

    FsTaskTypeManageComponent,
  ],
})
export class TaskTypeManageDialogComponent {

  @ViewChild(FsTaskTypeManageComponent)
  public taskTypeManage: FsTaskTypeManageComponent;

  public listConfig: FsListConfig;
  
  private _dialogRef = inject(MatDialogRef<FsTaskTypeManageComponent>);

  public openTaskType(taskType): void {
    this.taskTypeManage.openTaskType(taskType);
  }

  public close(value): void {
    this._dialogRef.close(value);
  }

  public save = () => {
    return of(true)
      .pipe(
        tap((response) => {
          this._dialogRef.close(response);
        }),
      );
  };

}
