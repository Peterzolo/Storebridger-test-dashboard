import _ from 'lodash';
import { injectable } from 'inversify';
import { IWallet, IWalletPresenter } from 'wallet';

export const WALLET_PRESENTER = Symbol('WalletPresenter');

@injectable()
export class WalletPresenter implements IWalletPresenter {
  public serialize(walletDocument: IWallet, selectors: (keyof IWallet)[]): Partial<IWallet> {
    const walletEntity = {
      id: walletDocument.id,
      userId: walletDocument.userId,
      balance: walletDocument.balance,
    };

    return _.pick(walletEntity, selectors);
  }
}
