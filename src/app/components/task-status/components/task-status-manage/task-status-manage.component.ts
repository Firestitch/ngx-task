import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TaskStatusData } from '../../../../data';
import { TaskStatusComponent } from '../task-status';


@Component({
  templateUrl: './task-status-manage.component.html',
  styleUrls: ['./task-status-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    MatButtonModule,
    MatDialogModule,

    FsListModule,
    FsChipModule,
    FsFormModule,
    FsDialogModule,
  ],
})
export class TaskStatusManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  
  constructor(
    private _dialogRef: MatDialogRef<TaskStatusManageComponent>,
    private _taskStatusData: TaskStatusData,
    private _dialog: MatDialog,
  ) {
    this._dialogRef.updateSize('400px');
  }

  public ngOnInit(): void {
    this.listConfig = {
      status: false,
      paging: false,
      style: 'card',
      reload: false,
      rowHoverHighlight: false,

      rowActions: [
        {
          icon: 'delete',
          menu: false,
          click: (taskStatus) => {
            return this._taskStatusData
              .delete(taskStatus);
          },
          remove: {
            template: 'Are you sure you want to delete this task status?',
          },
        },
      ],
      fetch: (query) => {
        return this._taskStatusData.gets(query, { key: null })
          .pipe(
            map((response) => ({ data: response.taskStatuses, paging: response.paging })),
          );
      },
      reorder: {
        done: (data) => {
          this._saveOrder(data.map((item) => item.data));
        },
      },
    };
  }

  public openTaskStatus(taskStatus?): void {
    this._dialog.open(TaskStatusComponent,{
      data: {
        taskStatus,
      },
    })
      .afterClosed()
      .pipe(
        tap(() => this.list.reload()),
      )
      .subscribe();
  }

  public close(value?): void {
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

  private _saveOrder(data): void {
    this._taskStatusData.order({
      taskStatusIds: list(data, 'id'),
      limit: data.length,
      offset: this.list.list.paging.offset,
    })
      .subscribe(() => {
        this.list.reload();
      });
  }

}
