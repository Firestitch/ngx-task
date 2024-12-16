import { Directive, TemplateRef } from '@angular/core';

import { Task } from '../../../../interfaces';


@Directive({
  selector: '[fsTaskTopToolbar]',
  standalone: true,
})
export class FsTaskTopToolbarDirective {

  public static ngTemplateContextGuard(
    directive: FsTaskTopToolbarDirective,
    context: unknown,
  ): context is {
    $implicit: TemplateRef<any>,
    task: Task,
  } {
    return true;
  }
}
