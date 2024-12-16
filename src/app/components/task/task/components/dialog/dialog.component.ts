import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule, MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsDialogModule } from '@firestitch/dialog';

import { Task } from '../../../../../interfaces';
import { DataApiService } from '../../../../../services';
import { FsTaskTopToolbarDirective } from '../../directives';
import { FsTaskComponent } from '../../task.component';


@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatDialogModule,
    MatIconModule,
    MatButtonModule,

    FsDialogModule,
    FsTaskComponent,
    FsTaskTopToolbarDirective,
  ],
  providers: [
    DataApiService,
  ],
})
export class FsTaskDialogComponent implements OnInit {

  public task: Task;
  
  private _dialogRef = inject(MatDialogRef);
  private _dataApiService = inject(DataApiService);
  private _data = inject<{ 
    task: Task,
    dataApiService: DataApiService,
  }>(MAT_DIALOG_DATA, { optional: true });

  public ngOnInit(): void {
    this.task = this._data.task;
    if(this._data?.dataApiService) {
      this._dataApiService.inherit(this._data.dataApiService);
    }
  }

  public close(value?): void {
    this._dialogRef.close(value);
  }

}
