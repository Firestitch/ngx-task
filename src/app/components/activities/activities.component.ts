import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsApi } from '@firestitch/api';
import { FsDateModule } from '@firestitch/date';
import { FilterConfig } from '@firestitch/filter';
import { FsMenuModule } from '@firestitch/menu';
import { FsPrompt } from '@firestitch/prompt';

import { switchMap } from 'rxjs/operators';

import { FsActivityDataDirective, FsActivityObjectDirective } from '../../directives';
import { FsActivityObjectTypeComponent } from '../activity-object-type';


@Component({
  selector: 'fs-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,

    FsMenuModule,
    FsDateModule,

    FsActivityObjectTypeComponent,
  ],
})
export class FsActivitiesComponent implements OnInit {

  @Input() public apiPath: string = '';

  @ContentChild(FsActivityObjectDirective) 
  public activityObject: TemplateRef<FsActivityObjectDirective>;

  @ContentChild(FsActivityDataDirective)
  public activityData: TemplateRef<FsActivityDataDirective>;

  public filterConfig: FilterConfig;
  public activities = [];
  public actions;
  public maxActivityId;

  private _api = inject(FsApi);
  private _prompt = inject(FsPrompt);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this._load();

    this.actions = {
      ['changeObject']: 'Changed',
      ['changeData']: 'Changed',
      ['addObject']: 'Added',
    };
  }

  public loadNew(): void {
    this._load();
  }

  public activityDelete(activity): void {
    this._prompt.confirm({
      title: 'Delete',
      template: 'Are you sure that you want to delete the record?',
    })
      .pipe(
        switchMap(() => this._api.delete(
          `${this.apiPath}activities/${activity.id}`,
        )),
      )
      .subscribe(() => {
        this.activities = this.activities
          .filter((a) => a.id !== activity.id);
          
        this._cdRef.markForCheck();
      });
  }

  private _load(): void {
    this._api
      .get(`${this.apiPath}activities`, {
        activityTypes: true,
        creatorObjects: true,
        concreteObjects: true,
        maxActivityId: this.maxActivityId,
        objectTypes: true,
      })
      .subscribe(({ activities }) => {
        this.maxActivityId = (
          activities?.length ? activities : this.activities
        ).reduce((max, activity) => {
          return activity.id > max ? activity.id : max;
        }, 0);

        this.activities = [
          ...activities,
          ...this.activities || [],
        ];

        this._cdRef.markForCheck();
      });
  }
}
