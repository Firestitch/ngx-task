import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsDialogModule } from '@firestitch/dialog';
import { FileProcessor, FsFile, FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsPrompt } from '@firestitch/prompt';

import { merge, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { TaskCommentData } from '../../../../../data';
import { TaskComment, TaskFile } from '../../../../../interfaces';


@Component({
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatIconModule,
    MatDialogModule,

    FsFormModule,
    FsDialogModule,
    FsFileModule,

    FsHtmlEditorModule,
  ],
})
export class CommentComponent implements OnDestroy, OnInit {

  public taskComment: TaskComment;
  public htmlEditorConfig: FsHtmlEditorConfig = {
    placeholder: 'Comment',
  };

  private _destroy$ = new Subject<void>();
  private _taskCommentData = inject(TaskCommentData);
  private _prompt = inject(FsPrompt);
  private _dialogRef = inject(MatDialogRef<CommentComponent>);
  private _cdRef = inject(ChangeDetectorRef);
  private _data = inject<{
    taskComment: TaskComment,
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this._taskCommentData
      .get(this._data.taskComment.taskId, this._data.taskComment.id, {
        taskFiles: true,
      })
      .subscribe((taskComment) => {
        this.taskComment = taskComment;
        this._cdRef.markForCheck();
      });
  }

  public selectFiles(fsFiles: FsFile[]): void {
    merge(
      ...fsFiles.map((fsFile) => {
        const fileProcessor = new FileProcessor();

        return fileProcessor.processFile(fsFile, {
          orientate: true,
          maxWidth: 2000,
          maxHeight: 2000,
        })
          .pipe(
            switchMap((file) => this._taskCommentData
              .postCommentTaskFile(this.taskComment.taskId, this.taskComment.id, file.file)),
          );
      }))
      .subscribe((taskFile) => {
        this.taskComment.taskFiles.push(taskFile);
        this._cdRef.markForCheck();
      });
  }

  public submit = () => {
    return this._taskCommentData
      .put(this.taskComment.taskId, this.taskComment)
      .pipe(
        tap((taskComment) => {
          this._dialogRef.close(taskComment);
        }),
      );
  };

  public removeFile(taskFile: TaskFile): void {
    this._prompt.confirm({
      title: 'Delete file',
      template: 'Are you sure you want to delete this file?',
    })
      .pipe(
        switchMap(() => this._taskCommentData
          .deleteCommentTaskFile(this.taskComment.taskId, this.taskComment.id, taskFile.id)),
      )
      .subscribe(() => {
        this.taskComment.taskFiles = this.taskComment.taskFiles
          .filter((file) => file.id !== taskFile.id);
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
