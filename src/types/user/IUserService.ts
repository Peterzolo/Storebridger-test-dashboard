import { IUser } from './IUser';
import { ICreateUser, IReadUser } from './IUserDTO';

export interface IUserService {
  create(payload: ICreateUser): Promise<Partial<IUser>>;
  read(query: IReadUser): Promise<Partial<IUser>>;
  readMany(query: IReadUser): Promise<Partial<IUser>[]>;
  search(query: IReadUser): Promise<Partial<IUser> | null>;
}
