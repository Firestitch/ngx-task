
import { FsApi, RequestConfig } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { forkJoin, Observable, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { DataApiService } from '../services';


export class TaskData<T = any> {

  constructor(
    private _dataApiService: DataApiService,
    private _api: FsApi,
  ) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      this._dataApiService.getApiPath([id]),
      query,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      this._dataApiService.getApiPath([]),
      query,
      {
        key: 'tasks',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      this._dataApiService.getApiPath([data.id]),
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([]),
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public taskTags(taskId, taskTags: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([taskId,'tags']),
      { taskTags },
      {
        key: 'task',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `tasks/${data.id}`,
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public commentPut(taskId, taskComment: any): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([taskId,'comments', taskComment.id]),
      { taskComment },
      {
        key: 'taskComment',
      },
    );
  }

  public commentPost(taskId, data: any, files: FsFile[] = []): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([taskId,'comments']),
      data,
      {
        key: 'taskComment',
      },
    )
      .pipe(
        switchMap((comment) => {
          return (
            files.length ? 
              forkJoin(
                files
                  .map((fsFile) => this._api
                    .post(this._dataApiService
                      .getApiPath([taskId,'comments',comment.id,'files']), { file: fsFile.file })),
              ) :
              of(comment)
          )
            .pipe(mapTo(comment));
        }),
      );
  }

  public describe(taskId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([taskId,'descriptions']),
      data,
      {
        key: 'taskDescription',
        ...config,
      },
    );
  }

  public watchers(taskId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      this._dataApiService.getApiPath([taskId,'watchers']),
      data,
      {
        key: 'task',
        ...config,
      },
    );
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
