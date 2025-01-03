import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { ItemType } from '@firestitch/filter';
import { FsFormModule } from '@firestitch/form';
import { FsListConfig, FsListModule } from '@firestitch/list';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TaskRelateData } from '../../../data';


@Component({
  templateUrl: './task-relate.component.html',
  styleUrls: ['./task-relate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatCheckboxModule,

    FsDialogModule,
    FsListModule,
    FsFormModule,
  ],
})
export class TaskRelateComponent implements OnInit {

  public listConfig: FsListConfig;
  public clients = {};
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<TaskRelateComponent>,
    private _taskRelateData: TaskRelateData,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public close(value?): void {
    this._dialogRef.close(value);
  }

  public checked(client): void {
    this.clients[client.id] = !this.clients[client.id];
    this._cdRef.markForCheck();
    
    if(this.clients[client.id]) {
      this._taskRelateData
        .relate(this._data.task.id, client.id, true)
        .subscribe();
    } else {
      this._taskRelateData
        .unrelate(this._data.task.id, client.id)
        .subscribe();
    }
  }

  public ngOnInit(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      status: false,
      reload: false,
      loadMore: true,
      rowEvents: {
        click: ({ row }) => {
          this.checked(row);
          this._cdRef.markForCheck();
        },
      },
      style: 'card',
      fetch: (query) => {
        query = {
          ...query,
          notClientId: (this._data.notObjectId || []).join(','),
        };

        return of({ data: [], paging: {} });

        // return this._clientData.gets(query, { key: null })
        //   .pipe(
        //     map(({ clients, paging }) => ({ data: clients, paging })),
        //   );
      },
    };
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
