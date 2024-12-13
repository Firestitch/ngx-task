import {
  Component,
  inject,
  Input,
} from '@angular/core';


import { DataApiService } from '../../services';


@Component({
  standalone: true,
  template: '',
})
export class FsBaseComponent {

  @Input('apiPath') public set apiPath(path: (string | number)[]) {
    this._dataApiService.apiPath = path;
  } 

  @Input('apiData') public set apiData(data: any) {
    this._dataApiService.apiData = data;
  }

  protected _dataApiService = inject(DataApiService);
 
}
