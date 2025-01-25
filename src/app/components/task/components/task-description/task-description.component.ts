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

import { tap } from 'rxjs/operators';

import { TaskData } from '../../../../data';
import { Task, TaskConfig } from '../../../../interfaces';
import { HtmlEditorService } from '../../services/html-editor.service';


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
  @Input() public config: TaskConfig;

  @Output() public descriptionCreated = new EventEmitter<any>();

  public description: string;
  public previousDescription: string;
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _htmlEditorService = inject(HtmlEditorService);
  private _taskData = inject(TaskData);

  public ngOnInit(): void {
    this.description = this.task.taskDescription?.description;
    this.previousDescription = this.description;
    this.htmlEditorConfig = {
      padless: true,
      placeholder: this.config.descriptionPlaceholder,
      label: this.config.descriptionLabel,
      initOnClick: true,
      image: this._htmlEditorService
        .getImageUploadConfig(this.task.id, this._taskData),
    };
  }

  public cancel(): void {
    this.description = this.previousDescription;
    this.htmlEditor.uninitialize();
  }

  public submit = () => {
    return this._taskData
      .describe(this.task.id, { description: this.description })
      .pipe(
        tap((response) => {
          this.previousDescription = this.description;
          this.htmlEditor.uninitialize();
          this.descriptionCreated.emit(response);
        }),
      );
  };

}
