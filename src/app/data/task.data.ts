
import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskData<T = any> {

  constructor(
    private _api: FsApi,
  ) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      [id],
      query,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      [],
      query,
      {
        key: 'tasks',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      [data.id],
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      [],
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public taskTags(taskId, taskTags: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      [taskId,'tags'],
      { taskTags },
      {
        key: 'task',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      [data.id],
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public describe(taskId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      [taskId,'descriptions'],
      data,
      {
        key: 'taskDescription',
        ...config,
      },
    );
  }

  public watchers(taskId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      [taskId,'watchers'],
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public getTaskWorkflowSteps(taskId: number, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      [taskId, 'workflowsteps'],
      {},
      {
        key: 'taskWorkflowSteps',
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
