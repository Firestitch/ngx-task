import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskTypeData } from '../../../../data';
import { TaskApiService } from '../../../../interceptors';
import { DataApiService } from '../../../../services';
import { TaskTypeManageDialogComponent } from '../task-type-manage-dialog';


@Component({
  selector: 'fs-task-type-autocomplete-chip',
  templateUrl: './task-type-autocomplete-chip.component.html',
  styleUrls: ['./task-type-autocomplete-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FsTaskTypeAutocompleteChipComponent,
      multi: true,
    },
    { provide: FsApi, useClass: TaskApiService },
    { 
      provide: DataApiService, 
      useFactory: () => {
        return inject(DataApiService, { optional: true, skipSelf: true }) || new DataApiService();
      },
    },
    { 
      provide: TaskTypeData, 
      useFactory: () => {
        return inject(TaskTypeData, { optional: true, skipSelf: true }) || new TaskTypeData();
      },
    },
  ],
  standalone: true,
  imports: [
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class FsTaskTypeAutocompleteChipComponent 
implements ControlValueAccessor, OnDestroy {

  @Input() public required = false;
  @Input() public initOnClick = false;

  public taskType;
  public onChange: (value) => void;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _dataApiService = inject(DataApiService);
  private _taskTypeData = inject(TaskTypeData);
  
  public openManage(): void {
    this._dialog.open(TaskTypeManageDialogComponent,{
      autoFocus: false,
      data: {
        dataApiService: this._dataApiService,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }
  
  public change(taskType): void {
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

  public fetch = (query): Observable<any> => {
    return this._taskTypeData
      .gets(query);
  };
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
