import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsMenuModule } from '@firestitch/menu';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { TaskTypeData } from '../../../../data';
import { TaskTypeChipComponent } from '../task-type-chip';
import { TaskTypeManageComponent } from '../task-type-manage';


@Component({
  selector: 'app-task-type-select',
  templateUrl: './task-type-select.component.html',
  styleUrls: ['./task-type-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TaskTypeSelectComponent,
    multi: true,
  }],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatButtonModule,

    FsMenuModule,

    TaskTypeChipComponent,
  ],
})
export class TaskTypeSelectComponent implements ControlValueAccessor, OnDestroy, OnInit {

  public taskType;
  public taskTypes = [];
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();

  constructor(
    private _taskTypeData: TaskTypeData,
    private _dialog: MatDialog,
  ) {
  }
  
  public openManage(): void {
    this._dialog.open(TaskTypeManageComponent,{
      autoFocus: false,
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.loadTaskTypes();
      });
  }
  
  public change(taskType): void {
    this.taskType = taskType;
    this.onChange(taskType);
  }

  public writeValue(taskType): void {
    this.taskType = taskType;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(): void {
    //
  }

  public setDisabledState?(): void {
    //
  }

  public ngOnInit(): void {
    this.loadTaskTypes();
  }

  public loadTaskTypes(): void {
    this._taskTypeData.gets()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((taskTypes) => {
        this.taskTypes = taskTypes;
      });
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
