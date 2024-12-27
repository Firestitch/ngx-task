import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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

import { Task } from '../../../../interfaces';
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
  
  private _dialogRef = inject(MatDialogRef);
  private _route = inject(ActivatedRoute);
  private _data = inject<{ 
    task: Task,
  }>(MAT_DIALOG_DATA, { optional: true });

  public ngOnInit(): void {
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
