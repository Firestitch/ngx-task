
import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskAccountData<T = any> {

  private _api = inject(FsApi);

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      ['accounts'],
      query,
      {
        key: 'accounts',
        ...config,
      },
    );
  }

}
