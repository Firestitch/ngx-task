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

import { DataApiService } from '../../../../../services';
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
})
export class CommentComponent implements OnDestroy, OnInit {

  public taskComment;
  public htmlEditorConfig: FsHtmlEditorConfig = {
    placeholder: 'Add a comment...',
  };

  private _destroy$ = new Subject<void>();
  private _dialogRef = inject(MatDialogRef<CommentComponent>);
  private _data = inject<{
    dataService: DataApiService,
    taskComment: TaskCommentComponent,
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.taskComment = this._data.taskComment;
  }

  public submit = () => {
    return this._data.dataService
      .createTaskData()
      .commentPut(this.taskComment.taskId, this.taskComment)
      .pipe(
        tap(() => {
          this._dialogRef.close();
        }),
      );
  };

  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
