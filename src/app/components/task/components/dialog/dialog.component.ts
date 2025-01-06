import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule, MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsDialogModule } from '@firestitch/dialog';

import { FS_TASK_CONFIG } from '../../../../injectors';
import { Task, TasksConfig } from '../../../../interfaces';
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
})
export class FsTaskDialogComponent implements OnInit {

  public task: Task;
  public config: TasksConfig;

  private _dialogRef = inject(MatDialogRef);
  private _route = inject(ActivatedRoute);
  private _injector = inject(Injector);
  private _taskConfig = inject(FS_TASK_CONFIG, { optional: true });
  private _data = inject<{ 
    task: Task,
    config: TasksConfig,
  }>(MAT_DIALOG_DATA, { optional: true });

  public ngOnInit(): void {
    const x = this._injector;
    console.log(x);
    this.config = { 
      ...this._taskConfig,
      ...this._data?.config,
    };

    if(this._data?.task) {
      this.task = this._data.task;
    } else if(this._route.snapshot.params.id) {
      this.task = { id: this._route.snapshot.params.id };
    }
  }

  public close(value?): void {
    this._dialogRef.close(value);
  }

}
