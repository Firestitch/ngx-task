import { CommonModule } from '@angular/common';
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
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsBadgeModule } from '@firestitch/badge';
import { FsChipModule } from '@firestitch/chip';
import { FsDateModule } from '@firestitch/date';
import { FsDialog } from '@firestitch/dialog';
import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { TaskAccountData, TaskData, TaskStatusData } from '../../../../data';
import { FS_TASKS_CONFIG, FS_TASKS_DEFAULT_CONFIG } from '../../../../injectors';
import { TaskApiService } from '../../../../interceptors/task-api.service';
import { TasksConfig } from '../../../../interfaces';
import { DataApiService } from '../../../../services';
import { FsBaseComponent } from '../../../base/base.component';
import { FsTaskComponent } from '../../../task';
import { PriorityChipComponent } from '../../../task-priority';
import { TaskStatusChipComponent } from '../../../task-status';
import { FsTaskTagChipComponent } from '../../../task-tag';
import { TaskTypeChipComponent } from '../../../task-type';
import { FsTaskDialogComponent } from '../../../task/components/dialog/dialog.component';
import { TaskAssignedAccountChipComponent } from '../task-assigned-account-chip';


@Component({
  selector: 'fs-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    FsListModule,
    FsChipModule, 
    FsBadgeModule,
    FsDateModule,

    TaskAssignedAccountChipComponent,
    PriorityChipComponent,
    TaskStatusChipComponent,
    TaskTypeChipComponent,
    FsTaskTagChipComponent,
  ],
  providers: [
    { provide: FsApi, useClass: TaskApiService },
    { 
      provide: DataApiService, 
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    TaskData,
    TaskStatusData,
    TaskAccountData,
  ],
})
export class FsTasksComponent extends FsBaseComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public config: TasksConfig;
  @Input() public assignedAccounts: { name: string, value: number }[];

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _fsDialog = inject(FsDialog);
  private _taskData = inject(TaskData);
  private _taskStatusData = inject(TaskStatusData);
  private _taskAccountData = inject(TaskAccountData);
  private _tasksDefaultConfig = inject(FS_TASKS_DEFAULT_CONFIG, { optional: true });
  private _tasksConfig = inject(FS_TASKS_CONFIG, { optional: true });
  private _injector = inject(Injector);

  public ngOnInit(): void {
    this._initConfig();
    this._initList();
    this._initDialog();
  }
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reload(): void {
    this.list.reload();
  }

  public openDialog(task: any): void {
    this._dialog.open(FsTaskDialogComponent, {
      injector: this._injector,
      data: {
        task,
        config: this.config.taskConfig,
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

  public openObject(task): void {
    if (task.state === 'deleted') {
      return;
    }
  }

  private _initDialog(): void {
    this._fsDialog.dialogRef$(FsTaskComponent)
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }

  private _initConfig(): void {
    this.config = {
      ...this._tasksDefaultConfig,
      ...this._tasksConfig,
      ...this.config,
    };
  }

  private _initList(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
        {
          name: 'taskStatusId',
          type: ItemType.AutoCompleteChips,
          label: 'Status',
          chipBackground: 'color',
          chipColor: '#fff',
          values: (keyword) => {
            return this._taskStatusData
              .gets({ keyword })
              .pipe(
                map((taskStatuses) => taskStatuses
                  .map((taskStatus) => ({
                    value: taskStatus.id,
                    name: taskStatus.name,
                    color: taskStatus.color,
                  })),
                ),
              );
          },
        },
        {
          name: 'assignedAccountId',
          type: ItemType.AutoCompleteChips,
          label: 'Assigned',
          default: this.assignedAccounts,
          values: (keyword) => {
            return this._taskAccountData
              .gets({ keyword })
              .pipe(
                map((accounts) => accounts
                  .map((account) => ({
                    value: account.id,
                    name: account.name,
                  })),
                ),
              );
          },
        },
        {
          name: 'dueDate',
          type: ItemType.DateRange,
          label: ['From Due Date', 'To Due Date'],
        },
      ],
      // savedFilters: {
      //   load: () => {
      //     return this._savedFilterData.gets()
      //       .pipe(
      //         map((savedFilters) => savedFilters
      //           .map((savedFilter) => ({
      //             ...savedFilter,
      //             active: savedFilter.id === this.activeSavedFilterId,
      //           })),
      //         ),
      //       );
      //   },
      //   save: (savedFilter: IFilterSavedFilter) => {
      //     return this._savedFilterData
      //       .save({
      //         ...savedFilter,
      //         type: 'task',
      //       });
      //   },
      //   delete: (savedFilter: IFilterSavedFilter) => {
      //     return this._savedFilterData.delete(savedFilter);
      //   },
      //   order: (savedFilters: IFilterSavedFilter[]) => {
      //     return this._savedFilterData.order(savedFilters);
      //   },
      // },
      actions: [
        {
          label: 'Create',
          show: () => this.config.showCreate,
          click: () => {
            this.openDialog({});
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._taskData
              .delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          taskStatuses: true,
          taskTypes: true,
          assignedAccounts: true,
          assignedAccountAvatars: true,
          modifyAccounts: true,
          modifyAccountAvatars: true,
          createAccounts: true,
          createAccountAvatars: true,
          taskTags: true,
        };

        if(this.config.subjectObject?.show) {
          query.subjectObjects = true;
        }
        
        return this._taskData
          .gets(query, { key: null })
          .pipe(
            map((response: any) => {
              const data = response.tasks
                .map((task) => {
                  const taskRouterLink = this.config.taskRouterLink ? 
                    [...this.config.taskRouterLink, task.id] : 
                    null;

                  return {
                    ...task,
                    taskRouterLink, 
                  };
                });

              return { data, paging: response.paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._taskData
            .put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

