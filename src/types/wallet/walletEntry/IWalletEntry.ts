export interface IWalletEntry {
  id?: string;
  walletId: string;
  userId: string;
  type: IWalletTransactionTypes;
  contractId?: string;
  balance: number;
  credit: number;
  debit: number;
  reference: string;
  recipientId: string;
  status: IWalletEntryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum IWalletTransactionTypes {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
  SENT = 'SENT',
  RECEIVE = 'RECEIVE',
}

export enum IWalletEntryStatus {
  FAILED = 'FAILED',
  PROCESSED = 'PROCESSED',
  PROCESSING = 'PROCESSING',
  UPCOMING = 'UPCOMING',
  UNKNOW = 'UNKNOWN',
}
