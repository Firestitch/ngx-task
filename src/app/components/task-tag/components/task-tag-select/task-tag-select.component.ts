import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {
  FsAutocompleteChipsComponent, FsAutocompleteChipsModule,
} from '@firestitch/autocomplete-chips';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskTagData } from '../../../../data';
import { TaskTagManageComponent } from '../task-tag-manage';


@Component({
  selector: 'app-task-tag-select',
  templateUrl: './task-tag-select.component.html',
  styleUrls: ['./task-tag-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TaskTagSelectComponent,
    multi: true,
  }],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class TaskTagSelectComponent implements ControlValueAccessor, OnDestroy {

  public taskTags = [];
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();

  constructor(
    private _taskTagData: TaskTagData,
    private _dialog: MatDialog,
  ) {
  }
  
  public openManage(event: MouseEvent, autocompleteChip: FsAutocompleteChipsComponent): void {
    autocompleteChip.closePanel();
    event.stopPropagation();

    this._dialog.open(TaskTagManageComponent,{
      autoFocus: false,
      data: {
        taskTagData: this._taskTagData,
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
  
  public change(taskTags): void {
    this.onChange(taskTags);
  }

  public writeValue(taskTags): void {
    this.taskTags = taskTags;
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
    return this._taskTagData.gets({ keyword });
  };
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
