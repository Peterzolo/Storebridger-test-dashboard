import { injectable } from 'inversify';
import { ICreateWalletEntry, IWalletEntry, IWalletEntryDTO } from 'wallet';

export const WALLET_ENTRY_DTO = Symbol('WalletEntryDTO');

@injectable()
export class WalletEntryDTO implements IWalletEntryDTO {
  public create(payload: ICreateWalletEntry): Partial<IWalletEntry> {
    const { userId, walletId, credit, debit, balance, reference, status, type, recipientId, contractId } = payload;

    return {
      userId,
      walletId,
      credit,
      debit,
      type,
      balance,
      status,
      reference,
      recipientId,
      contractId,
    };
  }
}
