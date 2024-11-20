import { Injectable } from '@angular/core';

@Injectable()
export class DataApiService {

  public apiPath: (number|string)[] = ['tasks'];

  public getApiPath(path: (number|string)[]): string {
    return [
      ...this.apiPath, 
      ...path,  
    ]
      .join('/');
  }
}
