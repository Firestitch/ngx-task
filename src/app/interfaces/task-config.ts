import { Activity } from '@firestitch/activity/app/interfaces';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';

import { Object } from './object';
import { Task } from './task';

export interface TaskConfig {
  comment?: {
    placeholder?: string;
    label?: string;
    htmlEditorConfig?: FsHtmlEditorConfig;
  };
  description?: {
    placeholder?: string;
    label?: string;
    htmlEditorConfig?: FsHtmlEditorConfig;
  };
  subjectObject?: {
    show?: boolean;
    label?: string;
    select?: (keywords: string[]) => Observable<Object[]>;
    change?: (task: Task, object: Object) => Observable<Task>;
    click?: (task: Task, object: Object) => void;
  },
  activity?: {
    showDeleteAction?: (activity: Activity) => boolean;
    showEditAction?: (activity: Activity) => boolean;
  }
}
