import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { map, tap } from 'rxjs/operators';

import { TaskStatusData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors';
import { DataApiService } from '../../../../services';
import { TaskStatusComponent } from '../task-status';


@Component({
  selector: 'fs-task-status-manage',
  templateUrl: './task-status-manage.component.html',
  styleUrls: ['./task-status-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    FsListModule,
    FsChipModule,
    FsFormModule,
  ],
  providers: [
    TaskStatusData,
    DataApiService,
    { provide: FsApi, useClass: TaskApiService },
  ],
})
export class FsTaskStatusManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;

  private _dialog = inject(MatDialog);
  private _taskStatusData: TaskStatusData;

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
            title: 'Confirm',
            template: 'Are you sure you want to delete this task status?',
          },
        },
      ],
      fetch: (query) => {
        return this._taskStatusData
          .gets(query, { key: null })
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
        taskStatusData: this._taskStatusData,
      },
    })
      .afterClosed()
      .pipe(
        tap(() => this.list.reload()),
      )
      .subscribe();
  }

  private _saveOrder(data): void {
    this._taskStatusData
      .order({
        taskStatusIds: list(data, 'id'),
        limit: data.length,
        offset: this.list.list.paging.offset,
      })
      .subscribe(() => {
        this.list.reload();
      });
  }

}
