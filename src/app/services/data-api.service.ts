import { Injectable } from '@angular/core';

@Injectable()
export class DataApiService {

  public apiPath: string[];

  public getApiPath(path: string): string {
    return [
      ...this.apiPath, 
      ...(path ? [path] : []),  
    ]
      .join('/');
  }
}
