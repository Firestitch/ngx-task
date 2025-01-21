import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject, Injector, Input, OnInit, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsApi } from '@firestitch/api';
import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { map, tap } from 'rxjs/operators';


import { TaskTypeData, TaskWorkflowData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors';
import { DataApiService } from '../../../../services';
import { FsBaseComponent } from '../../../base/base.component';
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

    MatIconModule,

    FsChipModule,
    FsSkeletonModule,
    FsListModule,
    FsFormModule,
  ],
  providers: [
    { provide: FsApi, useClass: TaskApiService },
    {
      provide: DataApiService,
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    TaskTypeData,
    TaskWorkflowData,
  ],
})
export class FsTaskTypeManageComponent extends FsBaseComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public showCreate = false;

  public listConfig: FsListConfig;

  private _taskTypeData = inject(TaskTypeData);
  private _dialog = inject(MatDialog);
  private _injector = inject(Injector);
  private _message = inject(FsMessage);

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
      actions: [
        {
          label: 'Create',
          primary: true,
          click: () => {
            this.openTaskType({});
          },
          show: () => this.showCreate,
        },
      ],
      rowActions: [
        {
          icon: (taskType) => {
            return taskType.default ? 'check_circle' : 'radio_button_unchecked';
          },
          menu: false,
          click: (taskType) => {
            this._taskTypeData
              .default(taskType)
              .subscribe(() => {
                this.list.getData()
                  .forEach((row) => {
                    row = {
                      ...row,
                      default: row.id === taskType.id,
                    };

                    this.list.updateData([row], (item) => row.id === item.id);
                  });
              });
          },
        },
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
      .open(TaskTypeComponent, {
        injector: this._injector,
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
        this._message.success();
        this.list.reload();
      });
  }


}
