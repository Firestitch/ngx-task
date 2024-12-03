
import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { DisplayApiError, FsApiConfig, makeInterceptorFactory, ProcessApiError } from '@firestitch/api';
import { FsErrorMessage } from '@firestitch/message';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';


export class ApiInterceptor implements HttpInterceptor {

  public readonly API_ERROR_RESOURCE_NOT_FOUND = 404;
  public readonly API_ERROR_INVALID_AUTHORIZATION = 490;

  constructor(
    public config: FsApiConfig,
    public data,
    private _injector: Injector,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'https://cure.local.firestitch.com/api/'.concat(req.url);

    const headers = req.headers;

    return next.handle(req.clone({ url, headers }))
      .pipe(
        catchError((event: HttpErrorResponse) => {
          if (this.config.context?.get(ProcessApiError) ?? true) {
            if (event.status === this.API_ERROR_RESOURCE_NOT_FOUND) {
              this._injector.get(Router).navigateByUrl('/notfound');
            } else if (event.status === this.API_ERROR_INVALID_AUTHORIZATION) {            
              this._injector.get(Router).navigateByUrl('/signin');
            } else if (this.config.context?.get(DisplayApiError) ?? true) {
              this._injector.get(FsErrorMessage).processHttpErrorResponse(event);
            }
          }

          return throwError(event);
        }),
      );
  }
}

export const ApiInterceptorFactory = makeInterceptorFactory(ApiInterceptor);
