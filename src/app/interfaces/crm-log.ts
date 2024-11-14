import { Account } from './account';

export interface CrmLog {
  createAccount?: Account;
  createAccountId?: number;
  createDate?: Date;
  id?: number;
  date?: Date;
  notes?: string;
  objectId?: number;
  state?: string;
  type?: string;
}