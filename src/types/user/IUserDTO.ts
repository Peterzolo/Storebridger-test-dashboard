import { IUser } from '.';

export interface ICreateUser {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IReadUser {
  ids?: string;
  id?: string;
  email?: string;
}
export interface IUserDTO {
  create(payload: ICreateUser): Partial<IUser>;
}
