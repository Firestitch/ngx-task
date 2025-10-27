
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
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
import { FsBaseComponent } from '../base/base.component';
import { TaskStatusChipComponent } from '../task-status';
import { FsTaskDialogComponent } from '../task/components/dialog';


@Component({
  selector: 'fs-tasks-summary',
  templateUrl: './tasks-summary.component.html',
  styleUrls: ['./tasks-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    FsListModule,
    FsHtmlRendererModule,
    FsActivityObjectTypeComponent,
    TaskStatusChipComponent
],
  providers: [
    TaskData,
    DataApiService,
    { provide: FsApi, useClass: TaskApiService },
  ],
})
export class FsTasksSummaryComponent extends FsBaseComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public subjectObjectId: number;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _taskData = inject(TaskData);
  private _injector = inject(Injector);

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
    this._dialog.open(FsTaskDialogComponent, {
      injector: this._injector,
      data: { 
        task,
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

