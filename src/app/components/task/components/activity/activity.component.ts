import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';


import { MatDialog } from '@angular/material/dialog';

import { FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { ActivityConfig } from '@firestitch/activity/app/interfaces';
import { FsDateModule } from '@firestitch/date';
import { FsHtmlRendererModule } from '@firestitch/html-editor';

import { filter } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Task, TaskConfig } from '../../../../interfaces';
import { PriorityChipComponent } from '../../../task-priority';
import { TaskStatusChipComponent } from '../../../task-status';
import { TaskTypeChipComponent } from '../../../task-type';
import { TaskAssignedAccountChipComponent } from '../../../tasks';
import { CommentGalleryComponent } from '../comment-gallery';

import { CommentComponent } from './comment';
import { TaskDueDatePipe } from './pipes/task-due-date.pipe';

@Component({
  selector: 'app-task-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsActivitiesComponent,
    FsActivityPreviewDirective,
    FsDateModule,
    FsHtmlRendererModule,

    TaskStatusChipComponent,
    PriorityChipComponent,
    CommentGalleryComponent,
    TaskDueDatePipe,
    TaskTypeChipComponent,
    TaskAssignedAccountChipComponent,
  ],
})
export class ActivityComponent implements OnInit {

  @Input() public task: Task;
  @Input() public config: TaskConfig;

  @ViewChild(FsActivitiesComponent)
  public activities: FsActivitiesComponent;

  public activityConfig: ActivityConfig;

  private _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);
  private _injector = inject(Injector);

  public loadNewActivities(): void {
    if (this.activities) {
      this.activities.loadNew();
    }
  }

  public ngOnInit(): void {
    const showDeleteAction = this.config.activity?.showDeleteAction || (() => false);
    const showEditAction = this.config.activity?.showEditAction || (() => false);

    this.activityConfig = {
      ...this.config.activity,
      apiPath: [this.task.id, 'activities'],
      actions: [
        {
          label: 'Edit',
          click: (activity) => {
            this._dialog.open(CommentComponent, {
              injector: this._injector,
              data: {
                config: this.config,
                taskComment: activity.concreteActivityObject,
              },
            })
              .afterClosed()
              .pipe(
                filter((taskComment) => !!taskComment),
                takeUntilDestroyed(this._destroyRef),
              )
              .subscribe((taskComment) => {
                activity.concreteActivityObject = taskComment;
                this.activities
                  .updateActivity(activity, (item) => item.id === activity.id);
              });
          },
          show: (activity) => showEditAction(activity)
            && activity.activityType.type === 'taskComment',
        },
      ],
      showDeleteAction,
    };
  }

}
