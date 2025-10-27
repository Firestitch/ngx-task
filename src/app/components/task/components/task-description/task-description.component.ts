
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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

import { TaskAccountData, TaskData } from '../../../../data';
import { Task, TaskConfig } from '../../../../interfaces';
import { HtmlEditorService } from '../../services/html-editor.service';


@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    FsFormModule,
    FsHtmlEditorModule
],
})
export class TaskDescriptionComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent, { static: true })
  public htmlEditor: FsHtmlEditorComponent;

  @Input() public task: Task;
  @Input() public config: TaskConfig;

  @Output() public descriptionCreated = new EventEmitter<any>();

  public description: string;
  public htmlEditorConfig: FsHtmlEditorConfig;

  private _htmlEditorService = inject(HtmlEditorService);
  private _taskData = inject(TaskData);
  private _taskAccountData = inject(TaskAccountData);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.description = this.task.taskDescription?.description;
    this.htmlEditorConfig = {
      ...this._htmlEditorService
        .getDescriptionConfig(
          this.config.description.htmlEditorConfig, 
          this.task.id, 
          this._taskData,
          this._taskAccountData,
        ),
      padless: true,
      disabled: this.config.description.disabled,
      placeholder: this.config.description.placeholder,
      label: this.config.description.label,
      initOnClick: true,
    };
  }

  public cancel(): void {
    this.description = this.task.taskDescription?.description;
    this._cdRef.markForCheck();
    this.htmlEditor.uninitialize();
  }

  public submit = () => {
    return this._taskData
      .describe(this.task.id, { description: this.description })
      .pipe(
        tap((taskDescription) => {
          this.task.taskDescription = taskDescription;
          this.cancel();
          this.descriptionCreated.emit(taskDescription);
        }),
      );
  };

}
