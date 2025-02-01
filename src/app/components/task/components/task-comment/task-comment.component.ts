import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';

import { of, Subject, zip } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

import { TaskAccountData, TaskCommentData, TaskData } from '../../../../data';
import { Account, Task, TaskConfig, TaskWorkflowStep } from '../../../../interfaces';
import { HtmlEditorService } from '../../services/html-editor.service';


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

    FsHtmlEditorModule,
  ],
})
export class TaskCommentComponent implements OnDestroy, OnInit {

  @Input() public task: Task;
  @Input() public config: TaskConfig;
  @Input() public taskWorkflowSteps: TaskWorkflowStep[] = [];
  @Input() public commentPlaceholder: string;

  @Output() public commentCreated = new EventEmitter<void>();
  @Output() public taskChange = new EventEmitter<Task>();

  public comment: string;
  public files: FsFile[] = [];
  public commentEnabled = false;
  public htmlEditorConfig: FsHtmlEditorConfig;
  public submitting = false;

  private _destroy$ = new Subject<void>();
  private _taskCommentData = inject(TaskCommentData);
  private _taskData = inject(TaskData);
  private _cdRef = inject(ChangeDetectorRef);
  private _taskAccountData = inject(TaskAccountData);
  private _htmlEditorService = inject(HtmlEditorService);

  public ngOnInit(): void {
    this.commentPlaceholder = this.commentPlaceholder || this.config.commentPlaceholder;
    this._initHtmlEditor();
  }

  public get account(): Account {
    return null;
  }
  
  public submit() {
    this.submit$()
      .subscribe();
  }

  public submit$() {
    this.submitting = true;
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
        finalize(() => {
          this.submitting = false;
          this._cdRef.markForCheck();
        }),
      );
  }

  public taskWorkflowStepClick(taskWorkflowStep: TaskWorkflowStep) {
    if(this.comment || this.files.length) {
      this.submit$()
        .pipe(
          switchMap(() => this.saveTaskStatus$(taskWorkflowStep)),
        )
        .subscribe();
    } else {
      this.saveTaskStatus$(taskWorkflowStep)
        .subscribe();
    }
  }

  public saveTaskStatus$(taskWorkflowStep: TaskWorkflowStep) {
    return this._taskData.save({ 
      id: this.task.id,
      taskStatusId: taskWorkflowStep.taskStatusId, 
    })
      .pipe(
        tap((task) => {
          this.taskChange.emit({
            ...this.task,
            ...task,
          });
        }),
      );
  }

  public cancelComment() {
    this.submitting = false;
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

  private _initHtmlEditor() {
    this.htmlEditorConfig = {
      ...this.config.commentHtmlEditorConfig,
      padless: true,
      placeholder: this.commentPlaceholder,
      autofocus: true,
      image: this._htmlEditorService
        .getImageUploadConfig(this.task.id, this._taskData),
      plugins: [
        this._htmlEditorService.getAccountMentionPlugin(this._taskAccountData),
      ],
    };
  }
}
