import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  templateUrl: './examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesComponent {
}
  
