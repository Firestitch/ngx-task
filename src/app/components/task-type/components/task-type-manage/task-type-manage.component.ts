import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { map, tap } from 'rxjs/operators';


import { TaskTypeData } from '../../../../data';
import { DataApiService } from '../../../../services';
import { TaskTypeComponent } from '../task-type';


@Component({
  selector: 'fs-task-type-manage',
  templateUrl: './task-type-manage.component.html',
  styleUrls: ['./task-type-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    FsChipModule,
    FsSkeletonModule,
    FsListModule,
    FsFormModule,
  ],
  providers: [
    TaskTypeData,
    DataApiService,
  ],
})
export class TaskTypeManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  
  private _taskTypeData = inject(TaskTypeData);
  private _dataApiService = inject(DataApiService);
  private _dialog = inject(MatDialog);
  private _data = inject<{ dataApiService: DataApiService }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this._dataApiService.inherit(this._data.dataApiService);
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
            title: 'Confirm',
            template: 'Are you sure you want to delete this task type?',
          },
        },
      ],
    };
  }

  public openTaskType(taskType): void {
    this._dialog
      .open(TaskTypeComponent,{
        data: {
          taskType,
          dataApiService: this._dataApiService,
        },
      })
      .afterClosed()
      .pipe(
        tap(() => this.list.reload()),
      )
      .subscribe();
  }

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
