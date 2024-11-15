import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FsChipModule } from '@firestitch/chip';
import { list } from '@firestitch/common';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TaskTagData } from '../../../../data';
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
    
    FsFormModule,
    FsListModule,
    FsDialogModule,
    FsChipModule,
    FsListModule,
  ],
})
export class TaskTagManageComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  
  constructor(
    private _dialogRef: MatDialogRef<TaskTagManageComponent>,
    private _taskTagData: TaskTagData,
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
          click: (data) => {
            return this._taskTagData
              .delete(data);
          },
          remove: {
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
    this._dialog.open(TaskTagComponent,{
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
        this.list.reload();
      });
  }

}
