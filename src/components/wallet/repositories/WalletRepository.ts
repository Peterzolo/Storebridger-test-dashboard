import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IWallet, IWalletRepository } from '../../../types/wallet';
import { Wallet } from '../models';

export const WALLET_REPOSITORY = Symbol('WalletRepository');

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(Wallet);
  }
}
