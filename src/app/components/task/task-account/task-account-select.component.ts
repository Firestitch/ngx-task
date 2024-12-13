import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import { Subject } from 'rxjs';

import { TaskAccountData } from '../../../data';


@Component({
  selector: 'app-task-account-select',
  templateUrl: './task-account-select.component.html',
  styleUrls: ['./task-account-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TaskAccountSelectComponent,
      multi: true,
    },
    TaskAccountData,
  ],
  standalone: true,
  imports: [
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class TaskAccountSelectComponent implements ControlValueAccessor, OnDestroy {

  public account;
  public onChange: (value) => void;

  private _taskAccountData = inject(TaskAccountData);
  private _destroy$ = new Subject<void>();

  public change(taskStatus): void {
    this.onChange(taskStatus);
  }

  public writeValue(account): void {
    this.account = account;
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
    return this._taskAccountData
      .gets({ keyword, avatars: true });
  };
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
