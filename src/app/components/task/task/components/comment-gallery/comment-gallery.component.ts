import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';

import { FsApi } from '@firestitch/api';
import {
  FsGalleryConfig, FsGalleryItem, FsGalleryModule,
} from '@firestitch/gallery';

import { Observable, of } from 'rxjs';

import { DataApiService } from '../../../../../services';


@Component({
  selector: 'app-comment-gallery',
  templateUrl: './comment-gallery.component.html',
  styleUrls: ['./comment-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsGalleryModule,
  ],
})
export class CommentGalleryComponent implements OnInit {

  @Input() public taskComment;

  public galleryConfig: FsGalleryConfig;
  
  private _dataApiService = inject(DataApiService);

  constructor(
    private _api: FsApi,
  ) { }

  public ngOnInit(): void {
    this.galleryConfig = {
      showChangeSize: false,
      showChangeView: false,
      reload: false,
      thumbnail: {
        width: 200,
        heightScale: .7,
      },
      itemActions: [
        {
          tooltip: 'Download',
          label: 'Download',
          icon: 'download',
          download: true,
        },
      ],
      fetch: (): Observable<FsGalleryItem[]> => {
        const items: FsGalleryItem[] = this.taskComment.taskFiles
          .map((taskFile) => {
            const url = this._api
              .createApiFile(this._dataApiService
                .getApiPath([this.taskComment.taskId,'files',taskFile.id,'download']));

            const item: FsGalleryItem = { 
              name: taskFile.file.filename,
              preview: taskFile.file.preview?.small,
              url,
              data: taskFile,
            };

            return item;
          });

        return of(items);
      },
    };
  }

}
