import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsDialogModule } from '@firestitch/dialog';
import { FileProcessor, FsFile, FsFileModule } from '@firestitch/file';
import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';

import { forkJoin, of, Subject, switchMap, tap } from 'rxjs';

import { TaskAccountData, TaskCommentData, TaskData } from '../../../../../data';
import { TaskComment, TaskFile } from '../../../../../interfaces';
import { HtmlEditorService } from '../../../services/html-editor.service';


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

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  public taskComment: TaskComment;
  public fsFiles: FsFile[] = [];
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _destroy$ = new Subject<void>();
  private _taskCommentData = inject(TaskCommentData);
  private _taskAccountData = inject(TaskAccountData);
  private _deletedTaskFiles: TaskFile[] = [];
  private _message = inject(FsMessage);
  private _prompt = inject(FsPrompt);
  private _dialogRef = inject(MatDialogRef<CommentComponent>);
  private _cdRef = inject(ChangeDetectorRef);
  private _htmlEditorService = inject(HtmlEditorService);
  private _taskData = inject(TaskData);
  private _data = inject<{
    taskComment: TaskComment,
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this._initHtmlEditorConfig();
    this._initTaskComment();
  }

  public selectFiles(fsFiles: FsFile[]): void {
    this.fsFiles = [
      ...this.fsFiles,
      ...fsFiles,
    ];
  }

  public submit = () => {
    return this._taskCommentData
      .put(this.taskComment.taskId, this.taskComment)
      .pipe(
        switchMap(() => {
          return this._deletedTaskFiles.length ? 
            forkJoin(
              this._deletedTaskFiles.map((taskFile) => this._taskCommentData
                .deleteCommentTaskFile(
                  this.taskComment.taskId,
                  this.taskComment.id,
                  taskFile.id,
                ),
              ),
            ) :
            of(null);
        }),
        switchMap(() => {
          return this.fsFiles.length ? 
            forkJoin(
              ...this.fsFiles.map((fsFile) => {
                const fileProcessor = new FileProcessor();
    
                return fileProcessor.processFile(fsFile, {
                  orientate: true,
                  maxWidth: 2000,
                  maxHeight: 2000,
                })
                  .pipe(
                    switchMap((file) => this._taskCommentData
                      .postCommentTaskFile(this.taskComment.taskId, this.taskComment.id, file.file)),
                    tap((taskFile) => {
                      this.taskComment.taskFiles.push(taskFile);
                    }),
                  );
              }),
            ) : 
            of(null);
        }),
        tap(() => {
          this._message.success();
          this._dialogRef.close(this.taskComment);
        }),
      );
  };

  public removeFile(fsFile: FsFile): void {
    this._prompt.confirm({
      title: 'Delete file',
      template: 'Are you sure you want to delete this file?',
    })
      .subscribe(() => {
        this.fsFiles = this.fsFiles
          .filter((item) => item !== fsFile);
        this._cdRef.markForCheck();
      });
  }

  public removeTaskFile(taskFile: TaskFile): void {
    this._prompt.confirm({
      title: 'Delete file',
      template: 'Are you sure you want to delete this file?',
    })
      .subscribe(() => {
        this._deletedTaskFiles.push(taskFile);
        this.taskComment.taskFiles = this.taskComment.taskFiles
          .filter((file) => file.id !== taskFile.id);
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initTaskComment(): void {
    this._taskCommentData
      .get(this._data.taskComment.taskId, this._data.taskComment.id, {
        taskFiles: true,
      })
      .subscribe((taskComment) => {
        this.taskComment = taskComment;
        this._cdRef.markForCheck();
      });
  }

  private _initHtmlEditorConfig(): void {
    this.htmlEditorConfig = {
      placeholder: 'Comment',
      plugins: [
        this._htmlEditorService.getAccountMentionPlugin(this._taskAccountData),
      ],
      image: this._htmlEditorService
        .getImageUploadConfig(this._data.taskComment.taskId, this._taskData),
    };
  }
}
