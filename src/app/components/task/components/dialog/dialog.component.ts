import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
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
import { FsSkeletonModule } from '@firestitch/skeleton';

import { map, of, switchMap, tap } from 'rxjs';

import { TaskData } from '../../../../data';
import { FS_TASK_CONFIG } from '../../../../injectors';
import { Task, TaskConfig } from '../../../../interfaces';
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
    FsSkeletonModule,
    FsTaskTopToolbarDirective,
  ],
})
export class FsTaskDialogComponent implements OnInit {

  public task: Task;
  public config: TaskConfig;

  private _taskData = inject(TaskData);
  private _dialogRef = inject(MatDialogRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _taskConfig = inject(FS_TASK_CONFIG, { optional: true });
  private _data = inject<{ 
    task: Task,
    config: TaskConfig,
  }>(MAT_DIALOG_DATA, { optional: true });

  public ngOnInit(): void {
    this.config = { 
      ...this._taskConfig,
      ...this._data?.config,
    };

    if(this._data?.task) {
      this.loadTask(this._data.task);
    } else if(this._route.snapshot.params.id) {
      this.loadTask({ id: this._route.snapshot.params.id });
    }
  }

  public loadTask(task: Task): void {
    of(null)
      .pipe(
        switchMap(() => {
          return task.id
            ? this._taskData
              .get(task.id, {
                taskStatuses: true,
                taskTypes: true,
                taskDescriptions: true,
                assignedAccounts: true,
                assignedAccountAvatars: true,
                taskTags: true,
                subjectObjects: this.config.subjectObject?.show ?? undefined,
              })
            : this._taskData
              .save({
                ...task,
              })
              .pipe(
                map((response) => {
                  return {
                    ...task,
                    ...response,
                  };
                }),
              );
        }),
        tap((_task: Task) => {
          this.task = {
            ..._task,
          };
        }),
        tap(() => this._cdRef.markForCheck()),
      )
      .subscribe();
  }

  public close(value?): void {
    this._dialogRef.close(value);
  }

}
