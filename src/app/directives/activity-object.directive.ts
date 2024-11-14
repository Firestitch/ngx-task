import { Directive } from '@angular/core';


@Directive({
  selector: '[fsActivityObject]',
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
