
import {
  ChangeDetectionStrategy, Component, inject, Injector, Input, OnInit, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsApi } from '@firestitch/api';
import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';

import { map, tap } from 'rxjs/operators';

import { TaskStatusData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors';
import { DataApiService } from '../../../../services';
import { FsBaseComponent } from '../../../base/base.component';
import { TaskStatusComponent } from '../task-status';


@Component({
  selector: 'fs-task-status-manage',
  templateUrl: './task-status-manage.component.html',
  styleUrls: ['./task-status-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    FsListModule,
    FsChipModule,
    FsFormModule
],
  providers: [
    { provide: FsApi, useClass: TaskApiService },
    {
      provide: DataApiService,
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    TaskStatusData,
  ],
})
export class FsTaskStatusManageComponent extends FsBaseComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public showCreate = false;

  public listConfig: FsListConfig;

  private _dialog = inject(MatDialog);
  private _message = inject(FsMessage);
  private _taskStatusData = inject(TaskStatusData);
  private _injector = inject(Injector);

  public ngOnInit(): void {
    this.listConfig = {
      status: false,
      paging: false,
      style: 'card',
      reload: false,
      rowHoverHighlight: false,
      actions: [
        {
          label: 'Create',
          primary: true,
          click: () => {
            this.openTaskStatus({});
          },
          show: () => this.showCreate,
        },
      ],
      rowActions: [
        {
          icon: (taskStatus) => {
            return taskStatus.default ? 'check_circle' : 'radio_button_unchecked';
          },
          menu: false,
          click: (taskStatus) => {
            this._taskStatusData
              .default(taskStatus)
              .subscribe(() => {
                this.list.getData()
                  .forEach((row) => {
                    row = {
                      ...row,
                      default: row.id === taskStatus.id,
                    };

                    this.list.updateData([row], (item) => row.id === item.id);
                  });
              });
          },
        },
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
    this._dialog.open(TaskStatusComponent, {
      injector: this._injector,
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
        this._message.success();
        this.list.reload();
      });
  }

}
