import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  
  constructor(
    private _iconRegistry: MatIconRegistry,
  ) {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

}
