import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


@Injectable()
export class TaskRelateData<T = any> {

  private _api = inject(FsApi);
  private _dataApiService = inject(DataApiService);

  public relate(taskId: number, objectId: number, pin, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath(`${taskId}/relates/${objectId}`),
      { pin },
      {
        ...config,
      },
    );
  }

  public unrelate(taskId: number, objectId: number, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      
      this._dataApiService.getApiPath(`${taskId}/relates/${objectId}`),
      {},
      {
        ...config,
      },
    );
  }


}
