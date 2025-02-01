import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';

import { Object } from './object';
import { Task } from './task';

export interface TaskConfig {
  commentPlaceholder?: string;
  descriptionPlaceholder?: string;
  descriptionLabel?: string;
  subjectObject?: {
    show?: boolean;
    label?: string;
    select?: (keywords: string[]) => Observable<Object[]>;
    change?: (task: Task, object: Object) => Observable<Task>;
    click?: (task: Task, object: Object) => void;
  },
  htmlEditorConfig?: FsHtmlEditorConfig;
  commentHtmlEditorConfig?: FsHtmlEditorConfig;
  descriptionHtmlEditorConfig?: FsHtmlEditorConfig;
}
