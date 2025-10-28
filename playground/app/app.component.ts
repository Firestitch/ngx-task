import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
  private _iconRegistry = inject(MatIconRegistry);

  
  constructor() {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

}
