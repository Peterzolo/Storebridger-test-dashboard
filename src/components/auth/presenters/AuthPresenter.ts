import _ from 'lodash';
import { injectable } from 'inversify';

import { IAuth, IAuthPresenter } from '../../../types/auth';

export const AUTH_PRESENTER = Symbol('AuthPresenter');

@injectable()
export class AuthPresenter implements IAuthPresenter {
  public serialize(authDocument: IAuth, selectors: Array<keyof IAuth> = ['email']): Partial<IAuth> {
    const authEntity = {
      id: authDocument.id,
      email: authDocument.email,
      status: authDocument.status,
      oauthId: authDocument.oauthId,
      password: authDocument.password,
      oauthType: authDocument.oauthType,
      primaryKey: authDocument.primaryKey,
      phoneNumber: authDocument.phoneNumber,
      secondaryKey: authDocument.secondaryKey,
      resetPassword: authDocument.resetPassword,
      hasVerifiedEmail: authDocument.hasVerifiedEmail,
      hasVerifiedPhone: authDocument.hasVerifiedPhone,
      resetPasswordToken: authDocument.resetPasswordToken,
      resetPasswordExpires: authDocument.resetPasswordExpires,
    };

    return _.pick(authEntity, selectors);
  }
}
