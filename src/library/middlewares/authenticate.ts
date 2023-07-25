import { NextFunction, Response, Request } from 'express';
import { JWT, AuthFailureError, AccessTokenError, validateTokenData, TokenExpiredError, logger } from '../helpers';
import { AUTH_SERVICE } from '../../components/auth/services';
import { IAuthService } from '../../types/auth';
import inversifyContainer from '../../ioc/inversify.config';
// import _ from 'lodash';

const container = inversifyContainer();
const authService = container.get<IAuthService>(AUTH_SERVICE);

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // if (_.isEmpty(req.cookies)) {
    //   logger.error('Token not supplied');
    //   throw new TokenExpiredError('Token has Expired');
    // }

    if (!req.header('Authorization')) {
      logger.error('Token not supplied');
      throw new TokenExpiredError('Token has Expired');
    }

    const token: string = req?.header('Authorization')?.split(' ')[1] || '';
    const parsedTokens = JSON.parse(token);
    const accessToken = parsedTokens.accessToken;
    const payload = await JWT.validate(accessToken);

    validateTokenData(payload);

    const auth = await authService.findAuth({ id: payload.sub, primaryKey: payload.prm });

    if (!auth) throw new AuthFailureError('User not registered or Invalid access token');

    req.email = auth.email;
    req.authId = payload.sub;

    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      next(new AccessTokenError(e.message));
    }
    next(e);
  }
};
