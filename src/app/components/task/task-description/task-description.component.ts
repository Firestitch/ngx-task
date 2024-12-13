import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { FsFormModule } from '@firestitch/form';
import {
  FsHtmlEditorComponent, FsHtmlEditorConfig, FsHtmlEditorModule,
} from '@firestitch/html-editor';

import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { TaskData } from '../../../data';
import { Task } from '../../../interfaces';
import { DataApiService } from '../../../services';


@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
    MatButtonModule,

    FsFormModule,
    FsHtmlEditorModule,
  ],
})
export class TaskDescriptionComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent, { static: true })
  public htmlEditor: FsHtmlEditorComponent;

  @Input() public task: Task;

  @Output() public descriptionCreated = new EventEmitter<void>();

  public description: string;
  public previousDescription: string;
  public htmlEditorConfig: FsHtmlEditorConfig = {
    placeholder: 'Provide task description (optional)....',
    initOnClick: true,
  };

  private _dataApiService = inject(DataApiService);
  private _taskData = inject(TaskData);
  
  public ngOnInit(): void {
    this.description = this.task.taskDescription?.description;
    this.previousDescription = this.description;
  }
  
  public cancel(): void {
    this.description = this.previousDescription;
    this.htmlEditor.uninitialize();
  }

  public submit = () => {
    return this._taskData
      .describe(this.task.id, { description: this.description })
      .pipe(
        switchMap(() => {
          if (this.task.state === 'draft') {
            return this._taskData
              .save({
                id: this.task.id,
                state: 'active',
              });
          }

          return of(null);
        }),
        tap(() => {
          this.previousDescription = this.description;
          this.htmlEditor.uninitialize();
          this.descriptionCreated.emit();
        }),
      );
  };

}
