
import {
  ChangeDetectionStrategy, Component, inject,
  Injector,
  OnInit, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { map, tap } from 'rxjs/operators';

import { TaskWorkflowData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors/task-api.service';
import { DataApiService } from '../../../../services';
import { FsBaseComponent } from '../../../base/base.component';
import { TaskWorkflowComponent } from '../task-workflow';


@Component({
  selector: 'fs-task-workflow-manage',
  templateUrl: './task-workflow-manage.component.html',
  styleUrls: ['./task-workflow-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsListModule
],
  providers: [
    { provide: FsApi, useClass: TaskApiService },
    { 
      provide: DataApiService, 
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    { 
      provide: TaskWorkflowData, 
      useFactory: () => {
        return inject(TaskWorkflowData, { optional: true, skipSelf: true }) || new TaskWorkflowData();
      },
    },
  ],
})
export class FsTaskWorkflowManageComponent extends FsBaseComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;
  
  private _taskWorkflowData = inject(TaskWorkflowData);
  private _dialog = inject(MatDialog);
  private _injector = inject(Injector);
  public ngOnInit(): void {
    this.listConfig = {
      paging: false,
      style: 'card',
      reload: false,
      rowHoverHighlight: false,
      fetch: (query) => {
        return this._taskWorkflowData.gets(query, { key: null })
          .pipe(
            map((response) => ({ data: response.taskWorkflows, paging: response.paging })),
          );
      },
      actions: [
        {
          label: 'Create',
          primary: true,
          click: () => {
            this.openTaskWorkflow({});
          },
        },
      ],
      rowActions: [
        {
          icon: 'delete',
          menu: false,
          click: (data) => {
            return this._taskWorkflowData
              .delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you want to delete this workflow?',
          },
        },
      ],
    };
  }

  public openTaskWorkflow(taskWorkflow): void {
    this._dialog
      .open(TaskWorkflowComponent,{
        injector: this._injector,
        data: {
          taskWorkflow,
        },
      })
      .afterClosed()
      .pipe(
        tap(() => this.list.reload()),
      )
      .subscribe();
  }

}
