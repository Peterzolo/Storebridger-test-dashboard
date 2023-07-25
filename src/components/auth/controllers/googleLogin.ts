import { Request, Response } from 'express';

import { AUTH_SERVICE } from '../services';
import { IAuthService } from '../../../types/auth';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const postGoogleLogin = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const oauthTokenId = req.body.idToken;
  const { tokens, user, cookieOptions } = await authService.googleLogin(oauthTokenId);

  res.cookie('tokens', tokens, cookieOptions);
  return new SuccessResponse(i18n.t('auth.signup.successResponse.login'), { user, tokens }).send(res);
};
