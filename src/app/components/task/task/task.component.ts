import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FsAuditsModule } from '@firestitch/audit';
import { FsChipModule } from '@firestitch/chip';
import { FsClipboardModule } from '@firestitch/clipboard';
import { FsCommonModule } from '@firestitch/common';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import {
  TaskAccountData, TaskAuditData, TaskRelateData,
  TaskStatusData,
  TaskTagData,
  TaskTypeData,
} from '../../../data';
import { TaskData } from '../../../data/task.data';
import { Task, TaskRelate } from '../../../interfaces';
import { DataApiService } from '../../../services';
import { PrioritySelectComponent } from '../../task-priority';
import { TaskStatusSelectComponent } from '../../task-status';
import { TaskTagSelectComponent } from '../../task-tag';
import { TaskTypeSelectComponent } from '../../task-type';
import { TaskAccountSelectComponent } from '../task-account';
import { TaskCommentComponent } from '../task-comment';
import { TaskDescriptionComponent } from '../task-description';
import { TaskRelateComponent } from '../task-relate';

import { ActivityComponent } from './activity';


@Component({
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,

    FsDialogModule,
    FsCommonModule,
    FsDatePickerModule,
    FsMenuModule,
    FsClipboardModule,
    FsSkeletonModule,
    FsLabelModule,
    FsChipModule,
    FsAuditsModule,
    TaskAccountSelectComponent,
    TaskCommentComponent,
    TaskDescriptionComponent,
    TaskTypeSelectComponent,
    TaskStatusSelectComponent,
    TaskAccountSelectComponent,
    PrioritySelectComponent,
    TaskTagSelectComponent,

    ActivityComponent,
  ],
  providers: [
    TaskData,
    TaskAccountData,
    TaskTagData,
    DataApiService,
    TaskAuditData,
    TaskRelateData,
    TaskTypeData,
    TaskStatusData,
  ],
})
export class FsTaskComponent implements OnInit, OnDestroy {

  @ViewChild(ActivityComponent)
  public activity: ActivityComponent; 

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent; 

  public task: Task;
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _destroy$ = new Subject<void>();
  
  private _taskData = inject(TaskData);
  private _taskAuditData = inject(TaskAuditData);
  private _taskRelateData = inject(TaskRelateData);
  private _taskAccountData = inject(TaskAccountData);
  private _router = inject(Router);
  private _location = inject(Location);
  private _message = inject(FsMessage);
  private _prompt = inject(FsPrompt);
  private _dialog = inject(MatDialog);
  private _dialogRef = inject(MatDialogRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _dataApiService = inject(DataApiService);
  private _data = inject<{ 
    task: Task,
    apiPath: string[],
  }>(MAT_DIALOG_DATA, { optional: true });

  public ngOnInit(): void {
    this._dataApiService.apiPath = this._data?.apiPath || ['tasks'];
    this._fetchData();
    this._initHtmlEditor();
  }
   
  public loadAudits = (query) => {
    return this._taskAuditData.gets(this.task.id, query);
  };

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  public save$(data) {
    return this._taskData.save({
      id: this.task.id,
      ...data,
    })
      .pipe(
        tap((task) => {
          this.task = {
            ...this.task,
            ...task,
          };
          this._cdRef.markForCheck();
          this.loadNewActivities();
          this._message.success('Saved Changes');
        }),
      );
  }

  public loadNewActivities(): void {
    this.activity.loadNewActivities();
  }

  public loadRelated(): void {
    this.loadNewActivities();
    this._taskData
      .get(this.task.id, {
        taskRelates: true,
        taskRelateObjects: true,
      })
      .subscribe((task) =>{
        this.task = { 
          ...this.task,
          ...task, 
        };
        this._cdRef.markForCheck();
      });
  }

  public relateRemove(taskRelate: TaskRelate): void {
    this._taskRelateData
      .unrelate(this.task.id, taskRelate.objectId)
      .subscribe(() => {
        this.task.taskRelates = this.task.taskRelates
          .filter((item) => item.objectId !== taskRelate.objectId);
        this._cdRef.markForCheck();
      });
  }

  public openWatcher(): void {
    this._taskData
      .get(this.task.id, {
        watchers: true,
      })
      .pipe(
        switchMap((task) => {
          return this._prompt
            .autocompleteChips({
              title: 'Watchers',
              label: 'Accounts',
              commitLabel: 'Save',
              required: false,
              default: task.watchers
                .map((item) => ({
                  name: item.name,
                  value: item,
                })),
              values: (keyword) => {
                const query = {
                  keyword,
                  notAccountId: task.watchers
                    .map((item) => item.id)
                    .join(','),
                };

                return this._taskAccountData
                  .gets(query)
                  .pipe(
                    map((account) => account
                      .map((item) => ({
                        name: item.name,
                        value: item,
                      })),
                    ),
                  );
              },
            })
            .pipe(
              catchError(() => of(null)),
            );
        }),
        filter((response) => !!response),
        switchMap((watchers) => {
          return this._taskData
            .watchers(this.task.id, {
              watchers,
            });
        }),
      )
      .subscribe((watchers) => {
        this.task.watchers = watchers;
        this._message.success();
      });
  }

  public save(data): void {
    this.save$(data).subscribe();
  }

  public close(value?): void {
    this._dialogRef.close(value);
  }

  public taskTypeChange(taskType?): void {
    this.save({
      taskTypeId: taskType?.id,
    });
  }

  public taskStatusChange(taskStatus?): void {
    this.save({
      taskStatusId: taskStatus?.id || null,
    });
  }

  public taskTagsChange(taskTags): void {
    this._taskData
      .taskTags(this.task.id, taskTags)
      .subscribe(() =>{
        this._message.success();
      });
  }

  public openRelate() {
    this._dialog.open(TaskRelateComponent, {
      data: { 
        task: this.task,        
        notObjectId: this.task.taskRelates
          .map((item) => item.objectId),
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.loadRelated();
      });
  }

  public assignedAccountChange(account?): void {
    this.save({
      assignedAccountId: account?.id || null,
    });
  }

  private _fetchData(): void {
    of(null)
      .pipe(
        switchMap(() => {
          const taskId = this._route.snapshot.params.id || this._data.task.id;

          return taskId
            ? this._taskData
              .get(taskId,{
                taskStatuses: true,
                taskTypes: true,
                taskDescriptions: true,
                assignedAccounts: true,
                assignedAccountAvatars: true,
                taskRelates: true,
                taskRelateObjects: true,
                taskTags: true,
                subjectObjects: true,
              })
            : this._taskData.save({
              ...this._data.task,
              state: 'draft',
            })
              .pipe(
                map((response) => {
                  return {
                    ...this._data.task,
                    ...response,
                  };
                }),
              );
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((task) => {
        this.task = { 
          ...task, 
          taskRelates: task.taskRelates || [],
        };

        this._cdRef.markForCheck();
      });
  }

  private _initHtmlEditor(): void {
    this.htmlEditorConfig = {
      label: 'Description',
      initOnClick: true,
    };
  }

}
