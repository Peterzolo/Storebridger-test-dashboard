import { Request, Response } from 'express';

import { AUTH_SERVICE } from '../services';
import { IAuthService } from '../../../types/auth';
import { SuccessResponse } from '../../../library/helpers';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const postLogin = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const { tokens, user, cookieOptions } = await authService.login(req.body);

  res.cookie('tokens', tokens, cookieOptions);
  return new SuccessResponse(i18n.t('auth.signup.successResponse.logIn'), { user, tokens }).send(res);
};

export const postLogout = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await authService.logout(req.authId);

  res.clearCookie('tokens');
  return new SuccessResponse(i18n.t('auth.signup.successResponse.logOut'), outcome).send(res);
};

export const postRefreshToken = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const token: string = req?.header('Authorization')?.split(' ')[1] || '';
  const parsedTokens = JSON.parse(token);
  const { accessToken, refreshToken } = parsedTokens;

  const { tokens, user, cookieOptions } = await authService.refreshAccessToken(accessToken, refreshToken);

  res.cookie('tokens', tokens, cookieOptions);

  return new SuccessResponse(i18n.t('auth.signup.successResponse.tokenRefreshSuccess'), { user, tokens }).send(res);
};
