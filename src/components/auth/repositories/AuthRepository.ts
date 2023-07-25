import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IAuth, IAuthRepository } from '../../../types/auth';
import { Auth } from '../models/Auth';

export const AUTH_REPOSITORY = Symbol('AuthRepository');

@injectable()
export class AuthRepository extends BaseRepository<IAuth> implements IAuthRepository {
  constructor() {
    super(Auth);
  }
}
