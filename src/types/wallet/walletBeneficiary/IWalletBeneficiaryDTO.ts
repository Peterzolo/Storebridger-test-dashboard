import { IWalletBeneficiary } from './IWalletBeneficiary';

export interface ICreateWalletBeneficiary {
  userId: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export interface IReadWalletBeneficiary {
  userId?: string;
  userEmail?: string;
}

export interface IVerifyAccountNumber {
  accountNumber: string;
  userEmail?: string;
  bankCode: string;
  bankName: string;
}

export interface IWalletBeneficiaryDTO {
  create(payload: ICreateWalletBeneficiary): Partial<IWalletBeneficiary>;
  verifyAccount(payload: IVerifyAccountNumber): IVerifyAccountNumber;
}
