
import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


export class TaskAccountData<T = any> {

  constructor(
    private _dataApiService: DataApiService,
    private _api: FsApi,
  ) {}

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath(['accounts']),
      query,
      {
        key: 'accounts',
        ...config,
      },
    );
  }

}
