import { IUser } from './IUser';

export interface IUserPresenter {
  serialize(userDocument: IUser, selectors: string[]): Partial<IUser>;
}
