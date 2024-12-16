import { Directive, TemplateRef } from '@angular/core';

import { Task } from '../../../interfaces';


@Directive({
  selector: '[fsTaskBottomToolbar]',
  standalone: true,
})
export class FsTaskBottomToolbarDirective {

  public static ngTemplateContextGuard(
    directive: FsTaskBottomToolbarDirective,
    context: unknown,
  ): context is {
    taskSelect: TemplateRef<any>,
    taskAccountSelect: TemplateRef<any>,
    taskPrioritySelect: TemplateRef<any>,
    taskDueDate: TemplateRef<any>,
    taskTagSelect: TemplateRef<any>,
    task: Task,
  } {
    return true;
  }
}
