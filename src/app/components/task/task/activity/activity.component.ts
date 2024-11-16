import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';


import { FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { FsDateModule } from '@firestitch/date';
import { FsHtmlRendererModule } from '@firestitch/html-editor';

import { Task } from '../../../../interfaces';
import { PriorityChipComponent } from '../../../task-priority';
import { TaskStatusChipComponent } from '../../../task-status';
import { CommentGalleryComponent } from '../comment-gallery';


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
  ],
})
export class ActivityComponent {

  @Input() public task: Task;
  
  @ViewChild(FsActivitiesComponent)
  public activities: FsActivitiesComponent; 
  
  public loadNewActivities(): void {
    if (this.activities) {
      this.activities.loadNew();
    }
  }

}
