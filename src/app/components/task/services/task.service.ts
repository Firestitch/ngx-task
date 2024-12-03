import { Injectable } from '@angular/core';


import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TaskService {

  public openObject(object, data: any = {}): Observable<any> {
    //switch (object.class) {

    // No default
    //}

    return of(null);
  }
}
