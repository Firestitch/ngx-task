import { Directive, inject, Input, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsActivityPreview]',
  standalone: true,
})
export class FsActivityPreviewDirective {

  @Input() public activityType: any;

  public templateRef = inject(TemplateRef);

  public static ngTemplateContextGuard(
    directive: FsActivityPreviewDirective,
    context: any,
  ): context is {
    data: any,
    activity: any
  } {
    return true;
  }

}
