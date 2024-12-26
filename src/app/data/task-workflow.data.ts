
import { inject, Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class TaskWorkflowData<T = any> {

  private _api = inject(FsApi);
  
  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      ['workflows',id],
      query,
      {
        key: 'taskWorkflow',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      ['workflows'],
      query,
      {
        key: 'taskWorkflows',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      ['workflows',data.id],
      data,
      {
        key: 'taskWorkflow',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      ['workflows'],
      data,
      {
        key: 'taskWorkflow',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      ['workflows',data.id],
      data,
      {
        key: 'taskWorkflow',
        ...config,
      },
    );
  }

  public deleteWorkflowStep(taskWorkflowId, taskWorkflowStep: any): Observable<T> {
    return this._api.delete(
      ['workflows',taskWorkflowId,'steps',taskWorkflowStep.taskStatusId],
      {},
      {
        key: 'taskWorkflowStep',
      },
    );
  }

  public putWorkflowStep(taskWorkflowId, taskWorkflowStep: any): Observable<T> {
    return this._api.put(
      ['workflows',taskWorkflowId,'steps',taskWorkflowStep.taskStatusId],
      taskWorkflowStep,
      {
        key: 'taskWorkflowStep',
      },
    );
  }

  public getWorkflowSteps(taskWorkflowId, data = {}): Observable<T> {
    return this._api.get(
      ['workflows',taskWorkflowId,'steps'],
      data,
      {
        key: 'taskWorkflowSteps',
      },
    );
  }

  public getWorkflowPaths(taskWorkflowId, data = {}): Observable<T> {
    return this._api.get(
      ['workflows',taskWorkflowId,'paths'],
      data,
      {
        key: 'taskWorkflowPaths',
      },
    );
  }

  public postWorkflowPath(taskWorkflowId, data = {}): Observable<T> {
    return this._api.post(
      ['workflows',taskWorkflowId,'paths'],
      data,
      {
        key: 'taskWorkflowPath',
      },
    );
  }

  public deleteWorkflowPath(taskWorkflowId, data: any = {}): Observable<T> {
    return this._api.delete(
      ['workflows',taskWorkflowId,'paths'],
      data,
      {
        key: 'taskWorkflowPath',
      },
    );
  }
  
  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
