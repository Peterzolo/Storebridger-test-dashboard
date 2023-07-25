import { IWalletBeneficiary } from './IWalletBeneficiary';

export interface IWalletBeneficiaryPresenter {
  serialize(
    walletBeneficiaryDocument: IWalletBeneficiary,
    selectors: Array<keyof IWalletBeneficiary>,
  ): Partial<IWalletBeneficiary>;
}
