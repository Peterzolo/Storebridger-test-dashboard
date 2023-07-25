import { injectable } from 'inversify';
import { lowerCase, capitalizeString } from '../../../library/helpers';
import { IUserDTO, ICreateUser, IUser } from '../../../types/user';

export const USER_DTO = Symbol('UserDTO');

@injectable()
export class UserDTO implements IUserDTO {
  public create(payload: ICreateUser): Partial<IUser> {
    const { email, firstName, lastName, phoneNumber } = payload;

    return {
      email: lowerCase(email),
      firstName: capitalizeString(firstName),
      lastName: capitalizeString(lastName),
      phoneNumber: phoneNumber,
    };
  }
}
