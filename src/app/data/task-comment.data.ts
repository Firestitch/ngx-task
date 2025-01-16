
import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { forkJoin, Observable, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';


@Injectable()
export class TaskCommentData<T = any> {

  constructor(
    private _api: FsApi,
  ) {}


  public get(taskId, commentId, query): Observable<T> {
    return this._api.get(
      [taskId,'comments', commentId],
      query,
      {
        key: 'taskComment',
      },
    );
  }

  public put(taskId, taskComment: any): Observable<T> {
    return this._api.put(
      [taskId,'comments', taskComment.id],
      taskComment,
      {
        key: 'taskComment',
      },
    );
  }

  public post(taskId, data: any, files: FsFile[] = []): Observable<T> {
    return this._api.post(
      [taskId,'comments'],
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
                    .post([taskId,'comments',comment.id,'files'], { file: fsFile.file })),
              ) :
              of(comment)
          )
            .pipe(mapTo(comment));
        }),
      );
  }

  public postCommentTaskFile(taskId, commentId, file: File): Observable<T> {
    return this._api.post(
      [taskId,'comments', commentId,'files'],
      { file },
      {
        key: '',
      },
    );
  }

  public deleteCommentTaskFile(taskId, commentId, taskFileId): Observable<T> {
    return this._api.delete(
      [taskId,'comments', commentId,'files', taskFileId],
      {},
      {
        key: '',
      },
    );
  }

}
