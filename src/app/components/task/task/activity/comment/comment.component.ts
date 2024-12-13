import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TaskData } from '../../../../../data';
import { TaskCommentComponent } from '../../../task-comment';


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

    FsHtmlEditorModule,
  ],
  providers: [
    TaskData,
  ],
})
export class CommentComponent implements OnDestroy, OnInit {

  public taskComment;
  public htmlEditorConfig: FsHtmlEditorConfig = {
    placeholder: 'Add a comment...',
  };

  private _destroy$ = new Subject<void>();
  private _taskData = inject(TaskData);
  private _dialogRef = inject(MatDialogRef<CommentComponent>);
  private _data = inject<{
    taskComment: TaskCommentComponent,
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.taskComment = this._data.taskComment;
  }

  public submit = () => {
    return this._taskData
      .commentPut(this.taskComment.taskId, this.taskComment)
      .pipe(
        tap((taskComment) => {
          this._dialogRef.close(taskComment);
        }),
      );
  };

  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
