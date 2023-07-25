import { injectable } from 'inversify';
import { IWalletEntry, IWalletEntryRepository } from 'wallet';
import { BaseRepository } from '../../../databases/mongodb';
import { WalletEntry } from '../models';

export const WALLET_ENTRY_REPOSITORY = Symbol('WalletEntryRepository');

@injectable()
export class WalletEntryRepository extends BaseRepository<IWalletEntry> implements IWalletEntryRepository {
  constructor() {
    super(WalletEntry);
  }
}
