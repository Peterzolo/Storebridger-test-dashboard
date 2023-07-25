import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { PAYMENT_SERVICE } from '../services';
import { IPaymentService } from '../../../types/payment';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const paymentService = container.get<IPaymentService>(PAYMENT_SERVICE);

export const postInitializePayment = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentService.initiatePayment({ ...req.body, email: req.email });

  return new SuccessResponse(
    i18n.t(translations.payment.responses.initiatePayment.initiatePaymentSuccessful),
    outcome,
  ).send(res);
};

export const postVerifyPayment = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentService.verifyPayment({ ...req.body, email: req.email });

  return new SuccessResponse(i18n.t(translations.payment.responses.verification.verificationSuccessful), outcome).send(
    res,
  );
};

export const getBanks = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentService.getBanks();

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};

export const postAccountNumberVerification = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentService.verifyAccountNumber({ ...req.body });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};
