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
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { TaskData } from '../../data';
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
    FsTaskComponent,  

    TaskStatusChipComponent,
  ],
})
export class FsTasksSummaryComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public subjectObjectId: number;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
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
    of(null)
      .pipe(
        switchMap(() => {
          return task.id ?
            of(task)
            : this._taskData.save({
              state: 'draft',
              subjectObjectId: this.subjectObjectId,
            });
        }),
        switchMap((_task) => {
          return this._dialog.open(FsTaskComponent, {
            data: { task: _task },
          })
            .afterClosed();
        }),
      )
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
        
        return this._taskData.gets(query, { key: null })
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

