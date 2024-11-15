import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import { of } from 'rxjs';

import { TaskPriorities } from '../../../../consts';


@Component({
  selector: 'app-priority-select',
  templateUrl: './priority-select.component.html',
  styleUrls: ['./priority-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PrioritySelectComponent,
    multi: true,
  }],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    FsAutocompleteChipsModule,
  ],
})
export class PrioritySelectComponent implements ControlValueAccessor {

  public taskPriorities;
  public taskPriority;
  public priority;
  public onChange: (value) => void;

  constructor() {
    this.taskPriorities = TaskPriorities
      .map((item) => {
        return {
          ...item,
          class: item.name.toLowerCase(),
        };
      });
  }
  
  public changePriority(priority): void {
    this.onChange(priority?.value);
  }

  public writeValue(priority): void {
    this.priority = priority;
    this.taskPriority = this.taskPriorities
      .find((item) => {
        return item.value === priority;
      });
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

  public fetch = () => {
    return of(this.taskPriorities);
  };

}
