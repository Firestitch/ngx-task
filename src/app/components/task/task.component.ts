import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FsApi } from '@firestitch/api';
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


import { TaskAccountData, TaskAuditData, TaskData, TaskStatusData } from '../../data';
import { TaskApiService } from '../../interceptors/task-api.service';
import { Task } from '../../interfaces';
import { DataApiService } from '../../services';
import { FsBaseComponent } from '../base/base.component';
import { PrioritySelectComponent } from '../task-priority';
import { TaskStatusSelectComponent } from '../task-status';
import { TaskTagSelectComponent } from '../task-tag';
import { TaskTypeSelectComponent } from '../task-type';

import { ActivityComponent } from './components/activity';
import { TaskAccountSelectComponent } from './components/task-account';
import { TaskCommentComponent } from './components/task-comment';
import { TaskDescriptionComponent } from './components/task-description';
import { FsTaskBottomToolbarDirective, FsTaskTopToolbarDirective } from './directives';


@Component({
  selector: 'fs-task',
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
  viewProviders: [
    { 
      provide: DataApiService, 
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    { provide: FsApi, useClass: TaskApiService },
    TaskData,
    TaskAccountData,
    TaskAuditData,    
    TaskStatusData,
  ],
})
export class FsTaskComponent extends FsBaseComponent implements OnInit, OnDestroy {

  @ContentChild(FsTaskTopToolbarDirective, { read: TemplateRef })
  public taskTopToolbar: TemplateRef<any>;

  @ContentChild(FsTaskBottomToolbarDirective, { read: TemplateRef })
  public taskBottomToolbar: TemplateRef<any>;

  @ViewChild(ActivityComponent)
  public activity: ActivityComponent; 

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent; 

  @Input('task') public set setTask(task: Task) {
    this._task = task;
  }

  public htmlEditorConfig: FsHtmlEditorConfig;
  public task: Task;

  private _destroy$ = new Subject<void>();
  private _message = inject(FsMessage);
  private _prompt = inject(FsPrompt);
  private _cdRef = inject(ChangeDetectorRef);
  private _taskData = inject(TaskData);
  private _taskAccountData = inject(TaskAccountData);
  private _taskAuditData = inject(TaskAuditData);
  private _task: Task;

  public ngOnInit(): void {
    this._fetchData();
    this._initHtmlEditor();
  }
   
  public loadAudits = (query) => {
    return this._taskAuditData
      .gets(this.task.id, query);
  };

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  public save$(data) {
    return this._taskData
      .save({
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

  public assignedAccountChange(account?): void {
    this.save({
      assignedAccountId: account?.id || null,
    });
  }

  private _fetchData(): void {
    of(null)
      .pipe(
        switchMap(() => {
          return this._task?.id
            ? this._taskData
              .get(this._task?.id,{
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
            : this._taskData
              .save({
                ...this._task,
                state: 'draft',
              })
              .pipe(
                map((response) => {
                  return {
                    ...this.task,
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