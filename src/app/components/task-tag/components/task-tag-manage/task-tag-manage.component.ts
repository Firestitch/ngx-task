import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TaskTagData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors/task-api.service';
import { DataApiService } from '../../../../services/data-api.service';
import { TaskTagComponent } from '../task-tag';


@Component({
  templateUrl: './task-tag-manage.component.html',
  styleUrls: ['./task-tag-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    MatButtonModule,
    MatDialogModule,

    FsFormModule,
    FsListModule,
    FsDialogModule,
    FsChipModule,
    FsListModule,
  ],
  providers: [
    { provide: FsApi, useClass: TaskApiService },
    {
      provide: DataApiService,
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    {
      provide: TaskTagData,
      useFactory: () => {
        return inject(TaskTagData, { optional: true, skipSelf: true }) || new TaskTagData();
      },
    },
  ],
})
export class TaskTagManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;

  private _dialogRef = inject(MatDialogRef<TaskTagManageComponent>);
  private _dialog = inject(MatDialog);
  private _injector = inject(Injector);
  private _taskTagData = inject(TaskTagData);
  private _message = inject(FsMessage);

  public ngOnInit(): void {
    this._dialogRef.updateSize('400px');
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
          click: (data) => {
            return this._taskTagData
              .delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you want to delete this task tag?',
          },
        },
      ],
      reorder: {
        done: (data) => {
          this._saveOrder(data.map((item) => item.data));
        },
      },
      fetch: (query) => {
        return this._taskTagData.gets(query, { key: null })
          .pipe(
            map((response) => ({ data: response.taskTags, paging: response.paging })),
          );
      },
    };
  }

  public openTaskTag(taskTag?): void {
    this._dialog.open(TaskTagComponent, {
      injector: this._injector,
      data: {
        taskTag,
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
    this._taskTagData.order({
      taskTagIds: list(data, 'id'),
      limit: data.length,
      offset: this.list.list.paging.offset,
    })
      .subscribe(() => {
        this._message.success();
        this.list.reload();
      });
  }

}
