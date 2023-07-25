import { injectable } from 'inversify';
import _ from 'lodash';
import { IWalletBeneficiary, IWalletBeneficiaryPresenter } from 'wallet';

export const WALLET_BENEFICIARY_PRESENTER = Symbol('WalletBeneficiaryPresenter');

@injectable()
export class WalletBeneficiaryPresenter implements IWalletBeneficiaryPresenter {
  public serialize(
    walletBeneficiaryDocument: IWalletBeneficiary,
    selectors: Array<keyof IWalletBeneficiary> = ['id'],
  ): Partial<IWalletBeneficiary> {
    const walletBeneficiaryEntity = {
      id: walletBeneficiaryDocument.id,
      userId: walletBeneficiaryDocument.userId,
      accountNumber: walletBeneficiaryDocument.accountNumber,
      accountName: walletBeneficiaryDocument.accountName,
      bankCode: walletBeneficiaryDocument.bankCode,
      bankName: walletBeneficiaryDocument.bankName,
      bankId: walletBeneficiaryDocument.bankId,
    };

    return _.pick(walletBeneficiaryEntity, selectors);
  }
}
