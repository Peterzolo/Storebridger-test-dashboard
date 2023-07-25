import { ContainerModule, interfaces } from 'inversify';
import { IAuthService, IAuthPresenter, IAuthRepository, IAuthDTO } from '../../../types/auth';
import { AUTH_DTO, AuthDTO } from '../dtos';
import { AUTH_SERVICE, AuthService } from '../services';
import { AUTH_PRESENTER, AuthPresenter } from '../presenters';
import { AuthRepository, AUTH_REPOSITORY } from '../repositories';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IAuthDTO>(AUTH_DTO).to(AuthDTO);
    bind<IAuthPresenter>(AUTH_PRESENTER).to(AuthPresenter);
    bind<IAuthRepository>(AUTH_REPOSITORY).to(AuthRepository);
    bind<IAuthService>(AUTH_SERVICE).to(AuthService).inSingletonScope();
  });
};
