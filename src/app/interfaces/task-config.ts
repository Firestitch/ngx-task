import { Activity, ActivityConfig } from '@firestitch/activity';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Observable } from 'rxjs';

import { Object } from './object';
import { Task } from './task';

export interface TaskConfig {
  status?: {
    disabled?: boolean,
  },
  assignedAccount?: {
    disabled?: boolean,
  },
  tags?: {
    disabled?: boolean,
  },
  dueDate?: {
    disabled?: boolean,
  },
  priority?: {
    disabled?: boolean,
  },
  taskType?: {
    disabled?: boolean,
  },
  name?: {
    disabled?: boolean,
  },
  watchers?: {
    disabled?: boolean,
  },
  comment?: {
    placeholder?: string;
    label?: string;
    htmlEditorConfig?: FsHtmlEditorConfig;
    disabled?: boolean
  };
  description?: {
    placeholder?: string;
    label?: string;
    htmlEditorConfig?: FsHtmlEditorConfig;
    disabled?: boolean
  };
  subjectObject?: {
    show?: boolean;
    label?: string;
    select?: (keywords: string[]) => Observable<Object[]>;
    change?: (task: Task, object: Object) => Observable<Task>;
    click?: (task: Task, object: Object) => void;
  },
  activity?: TaskActivityConfig;
  identifier?: {  
    copy?: (task: Task) => string;
  },
  disabled?: boolean
}

export interface TaskActivityConfig extends ActivityConfig {
  showEditAction?: (activity: Activity) => boolean;
}
