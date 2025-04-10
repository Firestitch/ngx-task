export interface Task {
  assignedAccountId?: number;
  assignedAccount?: any;
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
  taskRelates?: any[];
  taskTags?: any[];
  watchers?: any[];
  subjectObjectId?: number;
  subjectObject?: any;
}
