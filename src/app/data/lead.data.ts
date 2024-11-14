import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LeadData<T = any> {

  constructor(private _api: FsApi) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${id}`,
      query,
      {
        key: 'crmLead',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      'crm/leads',
      query,
      {
        key: 'crmLeads',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${data.id}`,
      data,
      {
        key: 'crmLead',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'crm/leads',
      data,
      {
        key: 'crmLead',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/${data.id}`,
      data,
      {
        key: 'crmLead',
        ...config,
      },
    );
  }

  public getFields(id: any, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${id}/fields`,
      {},
      {
        key: 'fields',
        ...config,
      },
    );
  }

  public getAssignAccounts(config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      'crm/leads/assign/accounts',
      {},
      {
        key: 'accounts',
        ...config,
      },
    );
  }

  public getAudits(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${id}/audits`,
      query,
      {
        key: 'audits',
        ...config,
      },
    );
  }

  public putFields(id: any, fields: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${id}/fields`,
      { fields },
      {
        key: 'fields',
        ...config,
      },
    );
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
