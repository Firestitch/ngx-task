import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {
  FsAutocompleteChipsComponent, FsAutocompleteChipsModule,
} from '@firestitch/autocomplete-chips';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataApiService } from '../../../../services';
import { TaskStatusManageComponent } from '../task-status-manage';


@Component({
  selector: 'app-task-status-select',
  templateUrl: './task-status-select.component.html',
  styleUrls: ['./task-status-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TaskStatusSelectComponent,
    multi: true,
  }],
  standalone: true,
  imports: [
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class TaskStatusSelectComponent implements ControlValueAccessor, OnDestroy {

  public taskStatus;
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();
  private _dataApiService = inject(DataApiService);
  private _dialog = inject(MatDialog);
  
  public openManage(event: MouseEvent, autocompleteChip: FsAutocompleteChipsComponent): void {
    autocompleteChip.closePanel();
    event.stopPropagation();

    this._dialog.open(TaskStatusManageComponent,{
      autoFocus: false,
      data: {
        taskStatusData: this._dataApiService.createTaskStatusData(),
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
    return this._dataApiService.createTaskStatusData().gets({ keyword });
  };
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
