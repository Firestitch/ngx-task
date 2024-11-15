import { Object } from "./object";

export interface TaskRelate {
  object?: Object;
  objectId?: number;
  order?: number;
  pin?: boolean;
  state?: string;
  taskId?: number;
  id?: number;
}