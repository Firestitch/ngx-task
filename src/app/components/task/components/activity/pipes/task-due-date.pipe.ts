import { Pipe, PipeTransform } from '@angular/core';

import { format, parseLocal } from '@firestitch/date';

@Pipe({
  name: 'taskDueDate',
  standalone: true,
})
export class TaskDueDatePipe implements PipeTransform {
  public transform(value: string): string {
    return value ? format(parseLocal(value), 'full-date') : null;
  }
}
