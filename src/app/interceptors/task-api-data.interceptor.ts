

import { RequestMethod } from '@firestitch/api';

import { Observable } from 'rxjs';

import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';

import { DataApiService } from '../services';


export class TaskApiDataInterceptor implements HttpInterceptor {

  constructor(
    private _dataApiService: DataApiService,
  ) {}  

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = req.params;
    let body = req.body;

    if(this._dataApiService.apiData) {
      if(req.method === String(RequestMethod.Get)) {
        Object.keys(this._dataApiService.apiData)
          .forEach((key) => {
            params = params.set(key, this._dataApiService.apiData[key]);
          });
      } else {
        body = {
          ...req.body,
          ...this._dataApiService.apiData,
        };
      }
    }

    return next.handle(req.clone({ params, body }));
  }
}
