import { IAuth } from './IAuth';

export interface IAuthPresenter {
  serialize(authDocument: IAuth, selectors: Array<keyof IAuth>): Partial<IAuth>;
}
