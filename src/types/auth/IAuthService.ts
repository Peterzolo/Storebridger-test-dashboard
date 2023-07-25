import { CookieOptions } from 'express';
import { IAuth } from './IAuth';
import { ICompleteSignup } from './IAuthDTO';

export interface ILoginOutcome {
  tokens: string;
  cookieOptions: CookieOptions;
  user: Partial<IAuth>;
}

export interface IGoogleOutcome {
  tokens: string;
  cookieOptions: CookieOptions;
}

export interface ICreateAuthOutcome {
  token: string;
  email: string;
}

export interface IAuthService {
  signup(email: string): Promise<Partial<IAuth & { signupCompletionToken?: string }>>;
  create(payload: { email: string }): Promise<ICreateAuthOutcome | null>;
  confirmSignupEmail(emailVerificationToken: string): Promise<Partial<IAuth>>;
  completeSignup(signupPayload: ICompleteSignup, emailVerificationToken: string): Promise<Partial<IAuth>>;
  login(payload: { email: string; password: string }): Promise<ILoginOutcome>;
  logout(authId: string): Promise<void>;
  refreshAccessToken(accessToken: string, refreshToken: string): Promise<ILoginOutcome>;
  forgotPassword(email: string): Promise<Partial<IAuth>>;
  confirmPasswordReset(emailVerificationToken: string): Promise<Partial<IAuth>>;
  completePasswordReset(token: string, password: string): Promise<Partial<IAuth>>;
  findAuth(query: Record<string, unknown>): Promise<IAuth | null>;
  veirfyPhone(payload: { email: string; phoneNumber: string }): Promise<Partial<IAuth>>;
  confirmPhone(phoneVerificationToken: string): Promise<Partial<IAuth>>;
  googleLogin(oauthTokenId: string): Promise<ILoginOutcome>;
}
