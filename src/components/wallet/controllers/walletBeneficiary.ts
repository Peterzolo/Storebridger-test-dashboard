import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { WALLET_BENEFICIARY_SERVICE } from '../services/WalletBeneficiaryService';
import inversifyContainer from '../../../ioc/inversify.config';
import { IWalletBeneficiaryService } from 'wallet';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const walletBeneficiariesService = container.get<IWalletBeneficiaryService>(WALLET_BENEFICIARY_SERVICE);

export const postCreateWalletBeneficiary = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletBeneficiariesService.create({ ...req.body, userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
};

export const getWalletBeneficiaries = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await walletBeneficiariesService.readMany({ userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};
