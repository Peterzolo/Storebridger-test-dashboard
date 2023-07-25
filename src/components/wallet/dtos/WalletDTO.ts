import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { ICreateWallet, IWallet, IWalletDTO, IGetWalletPaymentUrl, IUpdateWalletDTO } from '../../../types/wallet';
import { IWalletPayment } from 'wallet/IWalletDTO';

export const WALLET_DTO = Symbol('WalletDTO');
@injectable()
export class WalletDTO implements IWalletDTO {
  public create(payload: ICreateWallet): Partial<IWallet> {
    const { userId, pin } = payload;

    return {
      userId,
      balance: 0,
      pin: bcrypt.hashSync(pin),
    };
  }

  public getWalletPaymentUrl(query: IGetWalletPaymentUrl): IGetWalletPaymentUrl {
    const { userId, amount } = query;

    return {
      userId,
      amount,
      callBackUrl: `/payment`,
    };
  }

  public updateWalletDTO(payload: IUpdateWalletDTO): IUpdateWalletDTO {
    const { userId, amount } = payload;

    return {
      userId,
      amount,
    };
  }

  public walletPaymentDTO(payload: IWalletPayment): IWalletPayment {
    const { userId, amount, contractId, pin } = payload;

    return {
      userId,
      amount,
      contractId,
      pin,
    };
  }
}
