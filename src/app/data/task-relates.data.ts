
import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskRelateData<T = any> {

  private _api = inject(FsApi);
  
  public relate(taskId: number, objectId: number, pin, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      [taskId,'relates',objectId],
      { pin },
      {
        ...config,
      },
    );
  }

  public unrelate(taskId: number, objectId: number, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      [taskId,'relates',objectId],
      {},
      {
        ...config,
      },
    );
  }


}
