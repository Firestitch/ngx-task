import { Directive } from '@angular/core';


@Directive({
  selector: '[fsActivityObject]',
  standalone: true,
})
export class FsActivityObjectDirective {

  public static ngTemplateContextGuard(
    directive: FsActivityObjectDirective,
    context: unknown,
  ): context is {
    object: any,
    activity: any
  } {
    return true;
  }

}
