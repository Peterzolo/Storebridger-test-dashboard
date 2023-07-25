import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { lowerCase, capitalizeString } from '../../../library/helpers';
import { IAuthDTO, IAuth, ICompleteSignup, ILogin, IRefreshToken, IGoogleLogin } from '../../../types/auth';
import { TokenPayload } from 'google-auth-library';
import { OAuthType } from '../../../types/auth/IAuthDTO';

export const AUTH_DTO = Symbol('AuthDTO');

@injectable()
export class AuthDTO implements IAuthDTO {
  public signup(email: string): Partial<IAuth> {
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    return {
      email: lowerCase(email),
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
    };
  }

  public completeSignup(payload: ICompleteSignup): ICompleteSignup {
    const hash = bcrypt.hashSync(payload.password, 10);
    return {
      firstName: capitalizeString(payload.firstName),
      lastName: capitalizeString(payload.lastName),
      email: lowerCase(payload.email),
      password: hash,
      phoneNumber: payload.phoneNumber,
    };
  }

  public completePasswordReset(password: string): { password: string } {
    const hash = bcrypt.hashSync(password, 10);
    return {
      password: hash,
    };
  }

  public login(payload: { email: string; password: string; contractId?: string }): ILogin {
    const email = lowerCase(payload.email);
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    return {
      email: email,
      password: payload.password,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
      contractId: payload.contractId,
    };
  }

  public refreshToken(accessToken: string, refreshToken: string): IRefreshToken {
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    return {
      accessToken,
      refreshToken,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
    };
  }

  public googleLogin(googlePayload: TokenPayload, oauthTokenId: string): IGoogleLogin {
    const email = googlePayload.email;
    const firstName = googlePayload.given_name;
    const lastName = googlePayload.family_name;
    const googleId = googlePayload.sub;
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    return {
      oauthTokenId,
      oauthType: OAuthType.GOOGLE,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
      firstName: capitalizeString(firstName as string),
      lastName: capitalizeString(lastName as string),
      email: lowerCase(email as string),
      oauthId: lowerCase(googleId as string),
    };
  }
}
