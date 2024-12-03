import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsBadgeModule } from '@firestitch/badge';
import { FsFile, FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Account, Task } from '../../../interfaces';
import { DataApiService } from '../../../services';


@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatIconModule,

    FsFileModule,
    FsBadgeModule,
    FsFormModule,

    FsHtmlEditorModule,
  ],
})
export class TaskCommentComponent implements OnDestroy {

  @Input() public task: Task;

  @Output() public commentCreated = new EventEmitter<void>();

  public comment: string;
  public files: FsFile[] = [];
  public commentEnabled = false;
  public commentPlaceholder = 'Add a comment...';
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _destroy$ = new Subject<void>();
  private _dataApiService = inject(DataApiService);

  constructor() {
    this.htmlEditorConfig = {
      placeholder: this.commentPlaceholder,
    };
  }

  public get account(): Account {
    return null;
  }

  public submit = () => {
    return this._dataApiService
      .createTaskData()
      .commentPost(this.task.id, { comment: this.comment }, this.files)
      .pipe(
        tap(() => {
          this.cancelComment();
          this.commentCreated.emit();
        }),
      );
  };

  public cancelComment() {
    this.comment = '';
    this.files = [];
    this.commentEnabled = false;
  }

  public selectFiles(files: FsFile[]) {
    this.commentEnabled = true;
    this.files = [
      ...this.files,
      ...files,
    ];
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
