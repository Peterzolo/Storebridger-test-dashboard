import { Request, Response } from 'express';

import { AUTH_SERVICE } from '../services';
import { IAuthService } from '../../../types/auth';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const postVerifyPhone = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const payload = req.body;
  const outcome = await authService.veirfyPhone(payload);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.phoneVerificationSent'), outcome).send(res);
};

export const getConfirmPhone = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.confirmPhone(req.query.token as string);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.phoneVerificationSuccess'), outcome).send(res);
};
