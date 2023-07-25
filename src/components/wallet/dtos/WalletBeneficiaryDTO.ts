import { injectable } from 'inversify';
import { ICreateWalletBeneficiary, IVerifyAccountNumber, IWalletBeneficiary, IWalletBeneficiaryDTO } from 'wallet';

export const WALLET_BENEFICIARY_DTO = Symbol('WalletBeneficiaryDTO');

@injectable()
export class WalletBeneficiaryDTO implements IWalletBeneficiaryDTO {
  public create(payload: ICreateWalletBeneficiary): Partial<IWalletBeneficiary> {
    const { userId, accountNumber, bankCode, bankName, accountName } = payload;

    return {
      userId,
      accountNumber,
      bankCode,
      accountName,
      bankName,
    };
  }

  public verifyAccount(payload: IVerifyAccountNumber): IVerifyAccountNumber {
    const { accountNumber, bankCode, bankName } = payload;

    return {
      accountNumber,
      bankCode,
      bankName,
    };
  }
}
