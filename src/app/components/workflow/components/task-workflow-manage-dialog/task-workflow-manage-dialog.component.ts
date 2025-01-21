import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListConfig } from '@firestitch/list';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


import { FsTaskWorkflowManageComponent } from '../task-workflow-manage/task-workflow-manage.component';


@Component({
  templateUrl: './task-workflow-manage-dialog.component.html',
  styleUrls: ['./task-workflow-manage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatDialogModule,
    MatButtonModule,

    FsDialogModule,
    FsFormModule,

    FsTaskWorkflowManageComponent,
  ],
})
export class TaskWorkflowManageDialogComponent {

  @ViewChild(FsTaskWorkflowManageComponent)
  public taskWorkflowManage: FsTaskWorkflowManageComponent;

  public listConfig: FsListConfig;
  
  private _dialogRef = inject(MatDialogRef<FsTaskWorkflowManageComponent>);

  public openTaskWorkflow(taskWorkflow): void {
    this.taskWorkflowManage.openTaskWorkflow(taskWorkflow);
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
