import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


@Injectable()
export class TaskAccountData<T = any> {

  private _api = inject(FsApi);
  private _dataApiService = inject(DataApiService);

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath('accounts'),
      query,
      {
        key: 'accounts',
        ...config,
      },
    );
  }

}
