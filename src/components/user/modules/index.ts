import { ContainerModule, interfaces } from 'inversify';
import { IUserService, IUserPresenter, IUserRepository, IUserDTO } from '../../../types/user';
import { USER_DTO, UserDTO } from '../dtos';
import { USER_SERVICE, UserService } from '../services';
import { USER_PRESENTER, UserPresenter } from '../presenters';
import { UserRepository, USER_REPOSITORY } from '../repositories';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IUserDTO>(USER_DTO).to(UserDTO);
    bind<IUserPresenter>(USER_PRESENTER).to(UserPresenter);
    bind<IUserRepository>(USER_REPOSITORY).to(UserRepository);
    bind<IUserService>(USER_SERVICE).to(UserService).inSingletonScope();
  });
};
