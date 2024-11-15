import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


@Injectable()
export class TaskActivitiesData<T = any> {

  private _api = inject(FsApi);
  private _dataApiService = inject(DataApiService);

  public gets(taskId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath(`${taskId}/activities`),
      query,
      {
        key: null,
        ...config,
      },
    );
  }

  public delete(taskId: number, activityId: number): Observable<T> {
    return this._api.delete(
      this._dataApiService.getApiPath(`${taskId}/activities/${activityId}`),
    );
  }

}
