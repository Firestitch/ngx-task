import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';


import { FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { FsDateModule } from '@firestitch/date';
import { FsHtmlRendererModule } from '@firestitch/html-editor';

import { Task } from '../../../../interfaces';
import { DataApiService } from '../../../../services';
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
export class ActivityComponent implements OnInit {

  @Input() public task: Task;
  
  @ViewChild(FsActivitiesComponent)
  public activities: FsActivitiesComponent; 

  public apiPath: string;
  private _dataApiService = inject(DataApiService);
  
  public loadNewActivities(): void {
    if (this.activities) {
      this.activities.loadNew();
    }
  }

  public ngOnInit(): void {
    this.apiPath = this._dataApiService.getApiPath([this.task.id,'activities']);
  }

}
