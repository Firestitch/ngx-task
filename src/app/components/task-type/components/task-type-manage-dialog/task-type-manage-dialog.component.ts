import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsListConfig } from '@firestitch/list';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


import { DataApiService } from '../../../../services';
import { FsTaskTypeManageComponent } from '../task-type-manage/task-type-manage.component';


@Component({
  templateUrl: './task-type-manage-dialog.component.html',
  styleUrls: ['./task-type-manage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatDialogModule,
    MatButtonModule,

    FsDialogModule,
    FsFormModule,

    FsTaskTypeManageComponent,
  ],
  providers: [  
    DataApiService,
  ],
})
export class TaskTypeManageDialogComponent implements OnInit {

  @ViewChild(FsTaskTypeManageComponent)
  public taskTypeManage: FsTaskTypeManageComponent;

  public listConfig: FsListConfig;
  
  private _dialogRef = inject(MatDialogRef<FsTaskTypeManageComponent>);
  private _data = inject<{ dataApiService: DataApiService }>(MAT_DIALOG_DATA);
  private _dataApiService = inject(DataApiService);

  public ngOnInit(): void {
    this._dataApiService.inherit(this._data.dataApiService);
    this._dialogRef.updateSize('400px');
  }

  public openTaskType(taskType): void {
    this.taskTypeManage.openTaskType(taskType);
  }

  public close(value): void {
    this._dialogRef.close(value);
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
