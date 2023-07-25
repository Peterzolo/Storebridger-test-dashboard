import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { WALLET_ENTRY_SERVICE } from '../services';
import inversifyContainer from '../../../ioc/inversify.config';
import { IWalletEntryService, IWalletEntryStatus } from '../../../types/wallet';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const walletEntryService = container.get<IWalletEntryService>(WALLET_ENTRY_SERVICE);

export const getWalletEntries = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletEntryService.readMany({ userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};

export const getUpcomingWalletEntries = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletEntryService.readTransactionsByStatus({
    userEmail: req.email,
    status: IWalletEntryStatus.UPCOMING,
  });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};
