import { inject, injectable } from 'inversify';
import {
  ICreateUser,
  IReadUser,
  IUser,
  IUserDTO,
  IUserPresenter,
  IUserRepository,
  IUserService,
} from '../../../types/user';
import { USER_DTO } from '../dtos';
import { USER_PRESENTER } from '../presenters';
import { USER_REPOSITORY } from '../repositories';
import { BadRequestError, logger, NotFoundError } from '../../../library/helpers';

export const USER_SERVICE = Symbol('UserService');

@injectable()
export class UserService implements IUserService {
  private userAccessibleProperties: string[] = ['email', 'firstName', 'lastName', 'id', 'localeCode', 'currencyCode'];

  public constructor(
    @inject(USER_DTO) private readonly userDTO: IUserDTO,
    @inject(USER_PRESENTER) private readonly userPresenter: IUserPresenter,
    @inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  public async create(payload: ICreateUser): Promise<Partial<IUser>> {
    if (!payload) throw new BadRequestError('No payload provided to create user');

    const dto = this.userDTO.create(payload);
    const createdUser = (await this.userRepository.create(dto as IUser)) as IUser;

    // TODO: send welcome email
    return this.userPresenter.serialize(createdUser, this.userAccessibleProperties);
  }

  public async search(query: IReadUser): Promise<Partial<IUser> | null> {
    logger.info(`user search query ${JSON.stringify(query)}`);
    const user = await this.userRepository.findOne(query);
    if (!user) return null;

    return this.userPresenter.serialize(user as IUser, ['email', 'firstName', 'lastName', 'id']);
  }

  public async read(query: IReadUser): Promise<Partial<IUser>> {
    const user = await this.userRepository.findOne(query);
    if (!user) throw new NotFoundError('User not found');

    return this.userPresenter.serialize(user as IUser, this.userAccessibleProperties);
  }

  public async readMany(query: IReadUser): Promise<Partial<IUser>[]> {
    if (query && 'ids' in query) {
      const ids = query.ids && query.ids.split(',');
      const queryObj = { ids };
      const users = await this.userRepository.findByIdList(queryObj);

      return users.map((user) => this.userPresenter.serialize(user as IUser, this.userAccessibleProperties));
    }

    const users = await this.userRepository.find(query);

    return users.map((user) => this.userPresenter.serialize(user as IUser, this.userAccessibleProperties));
  }
}
