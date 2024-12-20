import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FsChipModule } from '@firestitch/chip';
import { FsDateModule } from '@firestitch/date';
import { FsDialog } from '@firestitch/dialog';
import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { TaskAccountData, TaskStatusData } from '../../../../data';
import { Account } from '../../../../interfaces';
import { DataApiService } from '../../../../services';
import { FsTaskComponent } from '../../../task';
import { PriorityChipComponent } from '../../../task-priority';
import { TaskStatusChipComponent } from '../../../task-status';
import { TaskTagChipComponent } from '../../../task-tag';
import { TaskTypeChipComponent } from '../../../task-type';
import { TaskData } from '../.././../../data/task.data';
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
    FsDateModule,

    TaskAssignedAccountChipComponent,
    PriorityChipComponent,
    TaskStatusChipComponent,
    TaskTypeChipComponent,
    TaskTagChipComponent,
  ],
  providers: [
    TaskData,
    TaskAccountData,
    TaskStatusData,
    DataApiService,
  ],
})
export class FsTasksComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input() public apiPath: (string | number)[] = ['tasks'];
  @Input() public activeSavedFilterId: number;
  @Input() public taskRouterLink: any[];
  @Input() public assignedAccounts: Account[] = [];

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dataApiService = inject(DataApiService);
  private _dialog = inject(MatDialog);

  private _dialogRef = inject(MatDialogRef, { optional: true });
  private _router = inject(Router);
  private _location = inject(Location);
  private _fsDialog = inject(FsDialog);
  private _taskData = inject(TaskData);
  private _taskStatusData = inject(TaskStatusData);
  private _taskAccountData = inject(TaskAccountData);

  public ngOnInit(): void {
    this._dataApiService.apiPath = this.apiPath;
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
    this._dialog.open(FsTaskComponent, {
      data: {
        task,
        apiPath: this.apiPath,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reload();
        if (!this._dialogRef && (task.state === 'draft' || !task.state)) {
          const url = this._router
            .parseUrl(`${window.location.pathname.replace(/\/\d+$/, '')}${window.location.search}`);
          this._location.replaceState(url.toString());
        }
      });
  }

  public openObject(task): void {
    if (task.state === 'deleted') {
      return;
    }

    // const dialog = this._taskService
    //   .openObject(task.subjectObject, {
    //     tab: 'tasks',
    //   });
    // dialog
    //   .then((dialogRef) => {
    //     dialogRef.afterClosed()
    //       .pipe(
    //         takeUntil(this._destroy$),
    //       )
    //       .subscribe(() => {
    //         this.list.reload();
    //       });
    //   });
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
            return this._taskStatusData.gets({ keyword })
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
          values: (keyword) => {
            return this._taskAccountData.gets({ keyword })
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
        // {
        //   name: 'subjectObjectId',
        //   type: ItemType.AutoCompleteChips,
        //   label: 'Client',
        //   hide: !!this.subjectObjectId,
        //   values: (keyword) => {
        //     return this._clientData.gets({ keyword })
        //       .pipe(
        //         map((response) => nameValue(response, 'name', 'id')),
        //       );
        //   },
        // },
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
          click: () => {
            this.openDialog({});
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._taskData.delete(data);
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
          taskTags: true,
          subjectObjects: true,
        };

        return this._taskData.gets(query, { key: null })
          .pipe(
            map((response: any) => {
              const data = response.tasks
                .map((task) => {
                  const taskRouterLink = this.taskRouterLink ?
                    [...this.taskRouterLink, task.id] :
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
          return this._taskData.put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

