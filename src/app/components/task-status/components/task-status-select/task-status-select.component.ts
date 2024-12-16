import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {
  FsAutocompleteChipsComponent, FsAutocompleteChipsModule,
} from '@firestitch/autocomplete-chips';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskStatusData } from '../../../../data';
import { TaskStatusManageDialogComponent } from '../task-status-manage-dialog';


@Component({
  selector: 'app-task-status-select',
  templateUrl: './task-status-select.component.html',
  styleUrls: ['./task-status-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TaskStatusSelectComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class TaskStatusSelectComponent implements ControlValueAccessor, OnDestroy {

  @Input() public padless = false;

  public taskStatus;
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();
  private _taskStatusData = inject(TaskStatusData);
  private _dialog = inject(MatDialog);
  
  public openManage(event: MouseEvent, autocompleteChip: FsAutocompleteChipsComponent): void {
    autocompleteChip.closePanel();
    event.stopPropagation();

    this._dialog.open(TaskStatusManageDialogComponent,{
      autoFocus: false,
      data: {
        taskStatusData: this._taskStatusData,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        autocompleteChip.focus();
      });
  }
  
  public change(taskStatus): void {
    this.onChange(taskStatus);
  }

  public writeValue(taskStatus): void {
    this.taskStatus = taskStatus;
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

  public fetch = (keyword) => {
    return this._taskStatusData.gets({ keyword });
  };
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
