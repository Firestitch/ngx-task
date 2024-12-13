
import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskAuditData<T = any> {

  constructor(
    private _api: FsApi,
  ) {}
  
  public gets(taskId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      [taskId,'audits'],
      query,
      {
        key: null,
        ...config,
      },
    );
  }

}
