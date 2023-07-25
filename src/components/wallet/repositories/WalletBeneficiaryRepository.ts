import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IWalletBeneficiary, IWalletBeneficiaryRepository } from 'wallet';
import { WalletBeneficiary } from '../models';

export const WALLET_BENEFICIARY_RESPOSITORY = Symbol('WalletBeneficiaryRespository');

@injectable()
export class WalletBeneficiaryRepository
  extends BaseRepository<IWalletBeneficiary>
  implements IWalletBeneficiaryRepository
{
  constructor() {
    super(WalletBeneficiary);
  }
}
