import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TaskService {

  constructor(
    private _dialog: MatDialog,
  ) {}

  public openObject(object, data: any = {}): Observable<any> {
    //switch (object.class) {

    // No default
    //}

    return of(null);
  }
}
