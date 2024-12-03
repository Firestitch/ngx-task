import { Injectable } from '@angular/core';

import { TaskData } from '../data';

@Injectable()
export class DataApiService {

  public apiPath: (number|string)[] = ['tasks'];

  public getApiPath(path: (number|string)[]): (number|string)[] {
    return [
      ...this.apiPath, 
      ...path,  
    ];
  }

  public createTaskData() {
    return new TaskData();
  }
}
