import { Read, Write } from '../../databases/mongodb';
import { IAuth } from './IAuth';

export interface IAuthRepository extends Read<IAuth>, Write<IAuth> {}
