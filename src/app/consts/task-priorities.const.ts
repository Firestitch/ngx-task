import { TaskPriority } from '../enums';

export const TaskPriorities = [
  { name: 'Critical', icon: 'priority_high', color: '#eb3824', value: TaskPriority.Critical },
  { name: 'High', icon: 'keyboard_arrow_up', color: '#eb8f24', value: TaskPriority.High },
  { name: 'Normal', icon: 'drag_handle', color: '#00a300', value: TaskPriority.Normal },
  { name: 'Low', icon: 'keyboard_arrow_down', color: '#8024eb', value: TaskPriority.Low },
];
