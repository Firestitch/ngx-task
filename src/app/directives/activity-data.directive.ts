import { Directive } from '@angular/core';


@Directive({
  selector: '[fsActivityData]',
  standalone: true,
})
export class FsActivityDataDirective {

  public static ngTemplateContextGuard(
    directive: FsActivityDataDirective,
    context: unknown,
  ): context is {
    data: any,
    activity: any
  } {
    return true;
  }

}
