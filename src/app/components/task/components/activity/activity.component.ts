import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';


import { MatDialog } from '@angular/material/dialog';

import { FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { FsDateModule } from '@firestitch/date';
import { FsHtmlRendererModule } from '@firestitch/html-editor';


import { filter } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Task } from '../../../../interfaces';
import { PriorityChipComponent } from '../../../task-priority';
import { TaskStatusChipComponent } from '../../../task-status';
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
  ],
})
export class ActivityComponent implements OnInit {

  @Input() public task: Task;
  
  @ViewChild(FsActivitiesComponent)
  public activities: FsActivitiesComponent; 

  public actions;

  private _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);
  private _cdRef = inject(ChangeDetectorRef);

  public loadNewActivities(): void {
    if (this.activities) {
      this.activities.loadNew();
    }
  }

  public ngOnInit(): void {
    this.actions = {
      'taskComment': [
        {
          label: 'Edit',
          click: (activity) => {
            this._dialog.open(CommentComponent, {
              data: {
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
                this._cdRef.markForCheck();
              });
          },
        },
      ],
    };
  }

}