import { Injectable } from '@angular/core';


@Injectable()
export class DataApiService {

  public apiPath: (number|string)[] = ['tasks'];
  public apiData: any;

  public getApiPath(path: (number|string)[]): (number|string)[] {
    return [
      ...this.apiPath, 
      ...path,  
    ];
  }

}
