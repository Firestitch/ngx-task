
import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskObjectData<T = any> {

  constructor(
    private _api: FsApi,
  ) {}
  
  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      ['objects'],
      query,
      {
        key: 'objects',
        ...config,
      },
    );
  }

}
