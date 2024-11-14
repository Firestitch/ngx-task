import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FormData<T = any> {

  constructor(private _api: FsApi) {}

  public leadForm(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      'crm/forms/lead',
      query,
      {
        key: '',
        ...config,
      },
    );
  }

  public leadFieldAction(field, action, data): Observable<any> {
    return this._api.put('crm/forms/lead/fields/actions', {
      action,
      data,
      field,
    }, { key: null });
  }

}
