import { Request, Response } from 'express';

import { AUTH_SERVICE } from '../services';
import { IAuthService } from '../../../types/auth';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const postForgotPassword = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.forgotPassword(req.body.email);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.signUp'), outcome).send(res);
};

export const getConfirmPasswordReset = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.confirmPasswordReset(req.query.token as string);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.emailConfirmed'), outcome).send(res);
};

export const postCompletePasswordReset = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const { token } = req.query;
  const { password } = req.body;
  const outcome = await authService.completePasswordReset(token as string, password as string);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.emailConfirmed'), outcome).send(res);
};
