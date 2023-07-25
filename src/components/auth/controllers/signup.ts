import { Request, Response } from 'express';

import { AUTH_SERVICE } from '../services';
import { IAuthService } from '../../../types/auth';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const postSignup = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.signup(req.body.email);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.signUp'), outcome).send(res);
};

export const getConfirmEmail = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.confirmSignupEmail(req.query.token as string);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.emailConfirmed'), outcome).send(res);
};

export const postCompleteSignup = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.completeSignup(req.body, req.query.token as string);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.emailConfirmed'), outcome).send(res);
};
