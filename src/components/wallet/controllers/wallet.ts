import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { WALLET_SERVICE } from '../services';
import inversifyContainer from '../../../ioc/inversify.config';
import { IWalletService } from 'wallet';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const walletService = container.get<IWalletService>(WALLET_SERVICE);

export const postDebit = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.debitWallet({ ...req.body, userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.wallet.responses.debitWallet.debitWalletSuccessful), outcome).send(
    res,
  );
};

export const postPaymentUrl = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.getCreditWalletPaymentUrl({ ...req.body, userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.wallet.responses.creditWallet.creditWalletSuccessful), outcome).send(
    res,
  );
};

export const getBalance = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.get({ userEmail: req.email });

  return new SuccessResponse(
    i18n.t(translations.wallet.responses.getWalletBalance.getWalletBalanceSuccess),
    outcome,
  ).send(res);
};

export const postCreateWallet = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.createWallet({ ...req.body, userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
};

export const getWalletStatus = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.getWalletStatus({ userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};

export const postWalletPayment = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletService.walletPayment({ ...req.body, userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
};
