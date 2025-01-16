import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsBadgeModule } from '@firestitch/badge';
import { FileProcessor, FsFile, FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';

import { of, Subject, zip } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { TaskCommentData } from '../../../../data';
import { Account, Task, TaskConfig } from '../../../../interfaces';


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
export class TaskCommentComponent implements OnDestroy, OnInit {

  @Input() public task: Task;
  @Input() public config: TaskConfig;
  @Input() public commentPlaceholder: string;

  @Output() public commentCreated = new EventEmitter<void>();

  public comment: string;
  public files: FsFile[] = [];
  public commentEnabled = false;
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _destroy$ = new Subject<void>();
  private _taskCommentData = inject(TaskCommentData);

  public ngOnInit(): void {
    this.commentPlaceholder = this.commentPlaceholder || this.config.commentPlaceholder;
    this.htmlEditorConfig = {
      padless: true,
      placeholder: this.commentPlaceholder,
    };
  }

  public get account(): Account {
    return null;
  }

  public submit = () => {
    const fileProcessor = new FileProcessor();
    const files$ = this.files.map((fsFile) => fileProcessor
      .processFile(fsFile, {
        orientate: true,
        quality: 0.9,
      }));
    
    return (files$.length ? zip(...files$) : of([]))
      .pipe(
        switchMap((files) => this._taskCommentData
          .post(this.task.id, { comment: this.comment }, files)),
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
