import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, ViewChild } from '@angular/core';

import { FsApi } from '@firestitch/api';
import {
  FsGalleryComponent,
  FsGalleryConfig, FsGalleryItem, FsGalleryModule,
} from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';

import { Observable, of, switchMap } from 'rxjs';


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
export class CommentGalleryComponent implements OnChanges {

  @Input() public taskComment;

  @ViewChild(FsGalleryComponent) 
  public gallery: FsGalleryComponent;

  public galleryConfig: FsGalleryConfig;

  private _prompt = inject(FsPrompt);
  private _api = inject(FsApi);

  public ngOnChanges(): void {
    this.initGallery();
  }

  public initGallery(): void {
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
        {
          tooltip: 'Remove',
          label: 'Remove',
          icon: 'clear',
          click: (item: FsGalleryItem) => {
            this._prompt.confirm({
              title: 'Remove file',
              template: 'Are you sure you want to remove this file?',
            })
              .pipe(
                switchMap(() => {
                  return this._api.delete([this.taskComment.taskId,'files',item.data.id]);
                }),
              )
              .subscribe(() => {
                this.gallery.reload();
              });
          },
        },
      ],
      fetch: (): Observable<FsGalleryItem[]> => {
        const items: FsGalleryItem[] = this.taskComment.taskFiles
          .map((taskFile) => {
            const url = this._api
              .createApiFile([this.taskComment.taskId,'files',taskFile.id,'download']);

            const item: FsGalleryItem = { 
              name: taskFile.file.filename,
              preview: taskFile.file.preview?.small,
              url,
              data: taskFile,
              guid: String(taskFile.id),
            };

            return item;
          });

        return of(items);
      },
    };
  }

}
