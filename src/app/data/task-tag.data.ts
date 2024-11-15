import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


@Injectable()
export class TaskTagData<T = any> {

  private _api = inject(FsApi);
  private _dataApiService = inject(DataApiService);

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      this._dataApiService.getApiPath(`tags/${id}`),
      query,
      {
        key: 'taskTag',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath('tags'),
      query,
      {
        key: 'taskTags',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      this._dataApiService.getApiPath(`tags/${data.id}`),
      data,
      {
        key: 'taskTag',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath('tags'),
      data,
      {
        key: 'taskTag',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      this._dataApiService.getApiPath(`tags/${data.id}`),
      data,
      {
        key: 'taskTag',
        ...config,
      },
    );
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

  public order(data): Observable<any> {
    return this._api.put(
      this._dataApiService.getApiPath('tags/order'),
      data,
      { key: null },
    );
  }

}
