
import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskTypeData<T = any> {

  constructor(
    private _api: FsApi,
  ) {}
  
  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      ['types',id],
      query,
      {
        key: 'taskType',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      ['types'],
      query,
      {
        key: 'taskTypes',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      ['types',data.id],
      data,
      {
        key: 'taskType',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      ['types'],
      data,
      {
        key: 'taskType',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      ['types',data.id],
      data,
      {
        key: 'taskType',
        ...config,
      },
    );
  }

  public order(data): Observable<any> {
    return this._api.put(
      ['types','order'],
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
