import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { PAYMENT_CONFIG_SERVICE } from '../services';
import { IPaymentConfigService } from '../../../types/payment';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const paymentConfigService = container.get<IPaymentConfigService>(PAYMENT_CONFIG_SERVICE);

export const postCreatePaymentConfig = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentConfigService.create({ ...req.body, creatorEmail: req.email });

  return new SuccessResponse(i18n.t('paymentConfig.responses.create.paymentConfigCreated'), outcome).send(res);
};

export const postSetDefaultPaymentConfig = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await paymentConfigService.setDefultPaymentConfig({ ...req.body, updaterEmail: req.email });

  return new SuccessResponse(i18n.t(translations.paymentConfig.responses.setDefaultPayment), outcome).send(res);
};
