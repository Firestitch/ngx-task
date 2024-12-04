
import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


export class TaskStatusData<T = any> {

  constructor(
    private _dataApiService: DataApiService,
    private _api: FsApi,
  ) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      this._dataApiService.getApiPath(['statuses',id]),
      query,
      {
        key: 'taskStatus',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath(['statuses']),
      query,
      {
        key: 'taskStatuses',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      this._dataApiService.getApiPath(['statuses',data.id]),
      data,
      {
        key: 'taskStatus',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath(['statuses']),
      data,
      {
        key: 'taskStatus',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      this._dataApiService.getApiPath(['statuses',data.id]),
      data,
      {
        key: 'taskStatus',
        ...config,
      },
    );
  }

  public order(data): Observable<any> {
    return this._api.put(
      this._dataApiService.getApiPath(['statuses','order']),
      data,
      { key: null },
    );
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
