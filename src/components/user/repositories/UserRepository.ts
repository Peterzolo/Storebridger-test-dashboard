import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IUser, IUserRepository } from '../../../types/user';
import { User } from '../models/User';

export const USER_REPOSITORY = Symbol('UserRepository');

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }
}
