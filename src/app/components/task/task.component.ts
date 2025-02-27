import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsChipModule } from '@firestitch/chip';
import { FsClipboard, FsClipboardModule } from '@firestitch/clipboard';
import { FsCommonModule } from '@firestitch/common';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FilterConfig, FsFilterModule, ItemType } from '@firestitch/filter';
import { FsHtmlEditorComponent } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';

import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { merge } from 'lodash-es';

import {
  TaskAccountData, TaskAuditData, TaskCommentData, TaskData, TaskStatusData,
} from '../../data';
import { FS_TASK_CONFIG } from '../../injectors';
import { FS_TASK_DEFAULT_CONFIG } from '../../injectors/task-default-config.injector';
import { TaskApiService } from '../../interceptors';
import { Object, Task, TaskConfig } from '../../interfaces';
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
import { HtmlEditorService } from './services/html-editor.service';


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
    FsLabelModule,
    FsChipModule,
    FsAuditsModule,
    FsAutocompleteChipsModule,
    FsFilterModule,

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
    TaskCommentData,
    HtmlEditorService,
  ],
})
export class FsTaskComponent extends FsBaseComponent implements OnInit, OnDestroy {

  @ContentChild(FsTaskTopToolbarDirective, { read: TemplateRef })
  public taskTopToolbar: TemplateRef<any>;

  @ContentChild(FsTaskBottomToolbarDirective, { read: TemplateRef })
  public taskBottomToolbar: TemplateRef<any>;

  @ViewChild(TaskCommentComponent)
  public commentComponent: TaskCommentComponent;

  @ViewChild(TaskDescriptionComponent)
  public descriptionComponent: TaskDescriptionComponent;

  @ViewChild(ActivityComponent)
  public activity: ActivityComponent;

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent;

  @Input() public task: Task;

  @Input() public config: TaskConfig = {};

  @Output()
  public saved = new EventEmitter<Task>();

  public activityFilterConfig: FilterConfig;

  private _destroy$ = new Subject<void>();
  private _message = inject(FsMessage);
  private _taskConfig = inject(FS_TASK_CONFIG, { optional: true });
  private _taskDefaultConfig = inject(FS_TASK_DEFAULT_CONFIG, { optional: true });
  private _prompt = inject(FsPrompt);
  private _cdRef = inject(ChangeDetectorRef);
  private _taskData = inject(TaskData);
  private _taskAccountData = inject(TaskAccountData);
  private _taskAuditData = inject(TaskAuditData);
  private _clipboard = inject(FsClipboard);

  public ngOnInit(): void {
    this._initConfig();
  }

  public loadAudits = (query) => {
    return this._taskAuditData
      .gets(this.task.id, query);
  };

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadTaskWorkflowSteps(): void {
    this.commentComponent.loadTaskWorkflowSteps();
  }

  public cancelDescription(): void {
    this.descriptionComponent.cancel();
  }

  public fetchSubjectObject = (keywords: string[]): Observable<Object[]> => {
    return this.config.subjectObject.select(keywords);
  };

  public selectedSuffixClick(subjectObject): void {
    this.config.subjectObject?.click(this.task, subjectObject);
  }

  public changeSubjectObject(object: Object) {
    this.config.subjectObject.change(this.task, object)
      .subscribe((task) => {
        this.task = {
          ...this.task,
          ...task,
        };
        this._cdRef.markForCheck();
      });
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
          this.loadMoreActivities();
          this.saved.emit(this.task);
          this._message.success('Saved Changes');
        }),
      );
  }

  public descriptionCreated(taskDescription): void {
    this.task.taskDescriptionId = taskDescription?.id;
    this.task.taskDescription = taskDescription;
    this.saved.emit(this.task);
    this.loadMoreActivities();
  }

  public loadMoreActivities(): void {
    this.activity.loadMoreActivities();
  }

  public commentTaskChange(task: Task): void {
    this.task = task;
    this.loadMoreActivities();
  }

  public loadRelated(): void {
    this.loadMoreActivities();
    this._taskData
      .get(this.task.id, {
        taskRelates: true,
        taskRelateObjects: true,
      })
      .subscribe((task) => {
        this.task = {
          ...this.task,
          ...task,
        };
        this._cdRef.markForCheck();
      });
  }

  public copyIdentifier(): void {
    const identifier = this.config.identifier?.copy ? 
      this.config.identifier.copy(this.task) : 
      this.task.identifier;
    
    this._clipboard.copy(identifier);
    this._message.success('Copied to clipboard');
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
    this.save$({
      taskTypeId: taskType?.id,
    })
      .pipe(
        tap(() => this.loadTaskWorkflowSteps()),
      )
      .subscribe();
  }

  public taskStatusChange(taskStatus?): void {
    this.save$({
      taskStatusId: taskStatus?.id || null,
    })
      .pipe(
        tap(() => this.loadTaskWorkflowSteps()),
      )
      .subscribe();
  }

  public taskTagsChange(taskTags): void {
    this._taskData
      .taskTags(this.task.id, taskTags)
      .subscribe(() => {
        this._message.success();
      });
  }

  public assignedAccountChange(account?): void {
    this.save({
      assignedAccountId: account?.id || null,
    });
  }

  private _initConfig(): void {
    this.activityFilterConfig = {
      persist: {
        name: 'taskActivities',
      },
      init: (query) => {
        this.activity.activities.setQuery(query);
        this.activity.loadActivities();
      },
      change: (query) => {
        this.activity.activities.setQuery(query);
        this.activity.loadActivities();
      },
      chips: false,
      queryParam: false,
      items: [
        {
          type: ItemType.AutoCompleteChips,
          name: 'activityTypeId',
          label: 'Activity type',
          values: (keyword) => this._taskData.activityTypes({ keyword })
            .pipe(
              map((activityTypes) => activityTypes
                .map((activityType) => ({
                  name: activityType.name,
                  value: activityType.id,
                }))),
            ),
        },
      ],
    };

    const defaultConfig = {
      comment: {
        placeholder: 'Add a comment...',
        label: 'Comment',
      },
      description: {
        placeholder: 'Add a description...',
        label: 'Description',
      },
      subjectObject: {
        show: false,
        label: 'Subject',
      },
    };

    this.config = merge(defaultConfig, this._taskDefaultConfig, this._taskConfig, this.config);
  }

}
