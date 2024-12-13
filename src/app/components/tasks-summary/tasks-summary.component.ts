import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';


import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsActivityObjectTypeComponent } from '@firestitch/activity';
import { FsApi } from '@firestitch/api';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { TaskData } from '../../data';
import { TaskApiService } from '../../interceptors/task-api.service';
import { DataApiService } from '../../services';
import { FsTaskComponent } from '../task';
import { TaskStatusChipComponent } from '../task-status';


@Component({
  selector: 'fs-tasks-summary',
  templateUrl: './tasks-summary.component.html',
  styleUrls: ['./tasks-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule,
    
    FsListModule,
    FsHtmlRendererModule,
    FsActivityObjectTypeComponent,

    TaskStatusChipComponent,
  ],
  providers: [
    TaskData,
    DataApiService,
    { provide: FsApi, useClass: TaskApiService },
  ],
})
export class FsTasksSummaryComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public subjectObjectId: number;

  @Input('apiPath') public set apiPath(path: (string | number)[]) {
    this._dataApiService.apiPath = path;
  }

  @Input('apiData') public set apiData(data: any) {
    this._dataApiService.apiData = data;
  }

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _dataApiService = inject(DataApiService);
  private _taskData = inject(TaskData);

  public ngOnInit(): void {
    this._initList();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reload(): void {
    this.list.reload();
  }

  public openTask(task: any): void {
    this._dialog.open(FsTaskComponent, {
      data: { 
        task,
        apiPath: this.apiPath,
        apiData: this.apiData,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reload();
      });
  }

  private _initList(): void {
    this.listConfig = {
      status: false,
      rowHoverHighlight: false,
      style: 'basic',      
      fetch: (query) => {
        query = {
          ...query,
          assignedAccounts: true,
          taskStatuses: true,
          subjectObjectId: this.subjectObjectId,
        };
        
        return this._taskData
          .gets(query, { key: null })
          .pipe(
            map(({ tasks, paging }) => {
              const data = tasks
                .map((task) => {

                  return {
                    ...task,
                  };
                });

              return { data, paging: paging };
            }),
          );
      },
    };
  }

}

