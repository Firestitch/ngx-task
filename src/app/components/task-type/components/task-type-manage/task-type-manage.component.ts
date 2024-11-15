import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';


import { TaskTypeData } from '../../../../data';
import { TaskTypeComponent } from '../task-type';


@Component({
  templateUrl: './task-type-manage.component.html',
  styleUrls: ['./task-type-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatDialogModule,
    MatButtonModule,

    FsChipModule,
    FsDialogModule,
    FsSkeletonModule,
    FsListModule,
    FsFormModule,
  ],
})
export class TaskTypeManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  
  constructor(
    private _dialogRef: MatDialogRef<TaskTypeManageComponent>,
    private _taskTypeData: TaskTypeData,
    private _dialog: MatDialog,
  ) {
    this._dialogRef.updateSize('400px');
  }

  public ngOnInit(): void {
    this.listConfig = {
      paging: false,
      style: 'card',
      reload: false,
      rowHoverHighlight: false,
      fetch: (query) => {
        return this._taskTypeData.gets(query, { key: null })
          .pipe(
            map((response) => ({ data: response.taskTypes, paging: response.paging })),
          );
      },
      reorder: {
        done: (data) => {
          this._saveOrder(data.map((item) => item.data));
        },
      },
      rowActions: [
        {
          icon: 'delete',
          menu: false,
          click: (data) => {
            return this._taskTypeData
              .delete(data);
          },
          remove: {
            template: 'Are you sure you want to delete this task type?',
          },
        },
      ],
    };
  }

  public openTaskType(taskType): void {
    this._dialog.open(TaskTypeComponent,{
      data: {
        taskType,
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
    this._taskTypeData.order({
      taskTypeIds: list(data, 'id'),
      limit: data.length,
      offset: this.list.list.paging.offset,
    })
      .subscribe(() => {
        this.list.reload();
      });
  }


}