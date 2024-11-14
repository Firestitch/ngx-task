import { Account } from './account';

export interface CrmNote {
  crmNoteVersion?: any;
  createAccount?: Account;
  createAccountId?: number;
  createDate?: Date;
  id?: number;
  modifyDate?: Date;
  objectId?: number;
  state?: string;
  title?: string;
}
