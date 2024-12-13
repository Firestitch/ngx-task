import { inject, Injector } from '@angular/core';

import { FsApi, RequestConfig, RequestMethod } from '@firestitch/api';

import { Observable } from 'rxjs';

import { HttpInterceptor } from '@angular/common/http';


import { DataApiService } from '../services';

import { TaskApiDataInterceptor } from './task-api-data.interceptor';
import { TaskApiPathInterceptor } from './task-api-path.interceptor';


export class TaskApiService extends FsApi {

  private _inject = inject(Injector);

  public request(
    method: RequestMethod | string, 
    url: string | (string | number)[], 
    data?: any,
    requestConfig?: RequestConfig,
  ): Observable<any> {
    requestConfig = requestConfig || {};
    requestConfig.interceptors = (interceptors: HttpInterceptor[]) => {
      interceptors = [
        new TaskApiPathInterceptor(this._inject.get(DataApiService)),
        ...interceptors,
        new TaskApiDataInterceptor(this._inject.get(DataApiService)),
      ];

      return interceptors;
    };

    return super.request(method, url, data, requestConfig);
  }
}
