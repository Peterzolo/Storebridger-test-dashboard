import _ from 'lodash';
import { injectable } from 'inversify';
import { IUser, IUserPresenter } from '../../../types/user';

export const USER_PRESENTER = Symbol('UserPresenter');

@injectable()
export class UserPresenter implements IUserPresenter {
  public serialize(document: IUser, selectors: string[] = ['email']): Partial<IUser> {
    const userEntity = {
      id: document.id,
      email: document.email,
      lastName: document.lastName,
      firstName: document.firstName,
      phoneNumber: document.phoneNumber,
      localeCode: document.localeCode,
      currencyCode: document.currencyCode,
    };

    return _.pick(userEntity, selectors);
  }
}
