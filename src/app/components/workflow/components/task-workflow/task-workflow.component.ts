import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { randomColor } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { tap } from 'rxjs/operators';

import { TaskWorkflowData } from '../../../../data';

import { DesignComponent } from './components/design';


@Component({
  templateUrl: './task-workflow.component.html',
  styleUrls: ['./task-workflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,

    FsDialogModule,
    FsSkeletonModule,
    FsFormModule,

    DesignComponent,
  ],
})
export class TaskWorkflowComponent implements OnInit {

  public taskWorkflow;
  public selectedIndex = 0;
  
  private _taskWorkflowData = inject(TaskWorkflowData);
  private _dialogRef = inject(MatDialogRef<TaskWorkflowComponent>);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);   
  private _data = inject<{ 
    taskWorkflow: any, 
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this._data.taskWorkflow.id) {
      this._taskWorkflowData
        .get(this._data.taskWorkflow.id)
        .subscribe((taskWorkflow) => {
          this.taskWorkflow = taskWorkflow;
          this._cdRef.markForCheck();
        });
    } else {
      this.taskWorkflow = {
        ...this._data.taskWorkflow,
        color: randomColor(),
      };
    }
  }
  
  public selectedIndexChange(index: number): void {
    this.selectedIndex = index;
    if (index === 1) {
      this._dialogRef.updateSize('90%', '90%');
    } else {
      this._dialogRef.updateSize('', '');
    }
  }

  public save = () => {
    return this._taskWorkflowData
      .save(this.taskWorkflow)
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          this.close(response);
        }),
      );
  };

  public close(data: any = null): void {
    this._dialogRef.close(data);
  }

}
