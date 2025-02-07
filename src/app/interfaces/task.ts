export interface Task {
  assignedAccountId?: number;
  assignedAccount?: any;
  identifier?: string;
  createDate?: Date;
  description?: string;
  dueDate?: Date;
  modifyDate?: Date;
  name?: string;
  priority?: number;
  state?: string;
  id?: number;
  number?: number;
  taskStatusId?: number;
  taskStatus?: any;
  taskType?: any
  taskTypeId?: number;
  taskDescriptionId?: number;
  taskDescription?: any;
  taskTags?: any[];
  watchers?: any[];
  subjectObjectId?: number;
  subjectObject?: any;
}
