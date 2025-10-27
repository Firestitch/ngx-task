
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsMenuModule } from '@firestitch/menu';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskTypeData } from '../../../../data';
import { DataApiService } from '../../../../services';
import { TaskTypeChipComponent } from '../task-type-chip';
import { TaskTypeManageDialogComponent } from '../task-type-manage-dialog';


@Component({
  selector: 'app-task-type-select',
  templateUrl: './task-type-select.component.html',
  styleUrls: ['./task-type-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TaskTypeSelectComponent,
      multi: true,
    },
    TaskTypeData,
  ],
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    FsMenuModule,
    TaskTypeChipComponent
],
})
export class TaskTypeSelectComponent implements ControlValueAccessor, OnDestroy, OnInit {

  @Input() public disabled = false;

  @Output() public taskTypeManageClosed = new EventEmitter<void>();

  public taskType;
  public taskTypes = [];
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _dataApiService = inject(DataApiService);
  private _taskTypeData = inject(TaskTypeData);
  private _injector = inject(Injector);

  public openManage(): void {
    this._dialog.open(TaskTypeManageDialogComponent,{
      autoFocus: false,
      injector: this._injector,
      data: {
        dataApiService: this._dataApiService,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.loadTaskTypes();
        this.taskTypeManageClosed.emit();
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
    this._taskTypeData
      .gets()
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
