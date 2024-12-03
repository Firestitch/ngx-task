import { inject, Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { TaskAccountData, TaskAuditData, TaskData, TaskRelateData, TaskStatusData } from '../data';

@Injectable()
export class DataApiService {

  public apiPath: (number|string)[] = ['tasks'];

  private _api = inject(FsApi);

  public getApiPath(path: (number|string)[]): (number|string)[] {
    return [
      ...this.apiPath, 
      ...path,  
    ];
  }

  public createTaskData() {
    return new TaskData(this, this._api);
  }

  public createTaskStatusData() {
    return new TaskStatusData(this, this._api);
  }

  public createTaskAccountData() {
    return new TaskAccountData(this, this._api);
  }

  public createTaskAuditData() {
    return new TaskAuditData(this, this._api);
  }

  public createTaskRelateData() {
    return new TaskRelateData(this, this._api);
  }
}
