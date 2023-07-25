import { IWalletBeneficiary } from './IWalletBeneficiary';
import { IVerifyAccountNumber, IReadWalletBeneficiary } from './IWalletBeneficiaryDTO';

export interface IWalletBeneficiaryService {
  create(payload: IVerifyAccountNumber): Promise<Partial<IWalletBeneficiary>>;
  readMany(payload: IReadWalletBeneficiary): Promise<Partial<IWalletBeneficiary>[]>;
}
