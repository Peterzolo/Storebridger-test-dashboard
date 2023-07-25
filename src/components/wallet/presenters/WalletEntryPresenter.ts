import _ from 'lodash';
import { injectable } from 'inversify';
import { IWalletEntry, IWalletEntryPresenter } from 'wallet';

export const WALLET_ENTRY_PRESENTER = Symbol('WalletEntryPresenter');

@injectable()
export class WalletEntryPresenter implements IWalletEntryPresenter {
  public serialize(
    walletEntryDocument: IWalletEntry,
    selectors: Array<keyof IWalletEntry> = ['id'],
  ): Partial<IWalletEntry> {
    const walletEntryEntity = {
      id: walletEntryDocument.id,
      userId: walletEntryDocument.userId,
      balance: walletEntryDocument.balance,
      type: walletEntryDocument.type,
      walletId: walletEntryDocument.walletId,
      credit: walletEntryDocument.credit,
      debit: walletEntryDocument.debit,
      reference: walletEntryDocument.reference,
      status: walletEntryDocument.status,
      createdAt: walletEntryDocument.createdAt,
      recipientId: walletEntryDocument.recipientId,
      updateAt: walletEntryDocument.updatedAt,
    };

    return _.pick(walletEntryEntity, selectors);
  }
}
