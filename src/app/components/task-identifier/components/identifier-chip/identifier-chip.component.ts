import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';
import { FsClipboard } from '@firestitch/clipboard';


/**
 * An object identifier, as the one chip every surface shares.
 *
 * The chip is the copy affordance — clicking it puts the identifier on the
 * clipboard, together with the object's name when one is passed — so no surface
 * carries a separate copy button beside it.
 */
@Component({
  selector: 'app-identifier-chip',
  templateUrl: './identifier-chip.component.html',
  styleUrls: ['./identifier-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipModule,
  ],
})
export class IdentifierChipComponent {

  public identifier = input<string>();

  /**
   * Copied after the identifier when set, so one click carries enough to paste
   * somewhere the identifier alone would say nothing. Written as it reads —
   * spaces stay spaces.
   */
  public name = input<string>();

  /**
   * `small` heads a drawer, dialog or detail view; `tiny` sits under a name in
   * a lister or any other dense row.
   */
  public size = input<'small' | 'tiny'>('small');

  /** The neutral pairing from the badge palette — an identifier is never a status. */
  public backgroundColor = '#f3f4f6';
  public color = '#6b7280';

  private _clipboard = inject(FsClipboard);

  public copy(): void {
    this._clipboard.copy([this.identifier(), this.name()].filter(Boolean).join(' '));
  }

}
