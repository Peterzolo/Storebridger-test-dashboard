import { Read, Write } from '../../databases/mongodb';
import { IUser } from './IUser';

export interface IUserRepository extends Read<IUser>, Write<IUser> {}
