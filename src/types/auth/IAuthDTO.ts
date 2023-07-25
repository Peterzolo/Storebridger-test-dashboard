import { TokenPayload } from 'google-auth-library';
import { IAuth } from './IAuth';

export interface ICompleteSignup {
  password: string;
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: string;
}

export interface ILogin {
  email: string;
  password: string;
  contractId?: string;
  primaryKey: string;
  secondaryKey: string;
}

export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
  primaryKey: string;
  secondaryKey: string;
}

export interface IGoogleLogin {
  oauthTokenId: string;
  oauthType: string;
  oauthId: string;
  primaryKey: string;
  secondaryKey: string;
  createdAuth?: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export enum OAuthType {
  LOCAL = 'LOCAL',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
}

export interface IAuthDTO {
  signup(email: string): Partial<IAuth>;
  completeSignup(payload: ICompleteSignup): ICompleteSignup;
  login(payload: { email: string; password: string; contractId?: string }): ILogin;
  refreshToken(accessToken: string, refreshToken: string): IRefreshToken;
  completePasswordReset(password: string): { password: string };
  googleLogin(googlePayload: TokenPayload, oauthTokenId: string): IGoogleLogin;
}
