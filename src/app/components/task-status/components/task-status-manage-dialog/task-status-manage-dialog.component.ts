import { CommonModule } from '@angular/common';
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
import { FsTaskStatusManageComponent } from '../task-status-manage';

@Component({
  templateUrl: './task-status-manage-dialog.component.html',
  styleUrls: ['./task-status-manage-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    MatButtonModule,
    MatDialogModule,

    FsFormModule,
    FsDialogModule,

    FsTaskStatusManageComponent,
  ],
  providers: [  
    DataApiService,
  ],
})
export class TaskStatusManageDialogComponent implements OnInit {

  @ViewChild(FsTaskStatusManageComponent)
  public statusManage: FsTaskStatusManageComponent;

  public listConfig: FsListConfig;

  private _dialogRef = inject(MatDialogRef<TaskStatusManageDialogComponent>);
  private _data = inject<{ dataApiService: DataApiService }>(MAT_DIALOG_DATA);
  private _dataApiService = inject(DataApiService);

  public ngOnInit(): void {
    this._dataApiService.inherit(this._data.dataApiService);
    this._dialogRef.updateSize('400px');
  }

  public openTaskStatus(taskStatus?): void {
    this.statusManage.openTaskStatus(taskStatus);
  }

  public close(value?): void {
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
