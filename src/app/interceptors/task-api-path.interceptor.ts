

import { Observable } from 'rxjs';

import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';

import { DataApiService } from '../services';


export class TaskApiPathInterceptor implements HttpInterceptor {

  constructor(
    private _dataApiService: DataApiService,
  ) {}  

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlParts = req.url ? req.url.split('/') : [];
    const url = this._dataApiService.getApiPath(urlParts).join('/');

    return next.handle(req.clone({ url }));
  }
}
