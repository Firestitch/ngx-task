
import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { DataApiService } from '../services';


export class TaskObjectData<T = any> {

  constructor(
    private _dataApiService: DataApiService,
    private _api: FsApi,
  ) {}
  
  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath(['objects']),
      query,
      {
        key: 'objects',
        ...config,
      },
    );
  }

}
