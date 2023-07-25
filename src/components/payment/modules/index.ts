import { ContainerModule, interfaces } from 'inversify';
import {
  IPaymentConfigDTO,
  IPaymentConfigPresenter,
  IPaymentConfigRepository,
  IPaymentConfigService,
  IPaymentDTO,
  IPaymentPresenter,
  IPaymentRepository,
  IPaymentService,
} from 'payment';
import { PAYMENT_CONFIG_DTO, PaymentConfigDTO, PAYMENT_DTO, PaymentDTO } from '../dtos';
import { PAYMENT_CONFIG_PRESENTER, PaymentConfigPresenter, PAYMENT_PRESENTER, PaymentPresenter } from '../presenters';
import { PAYMENT_CONFIG_REPOSITORY, PaymentConfigRepository } from '../repositories';
import { PaymentRepository, PAYMENT_REPOSITORY } from '../repositories/PaymentRepository';
import { PAYMENT_CONFIG_SERVICE, PaymentConfigService, PAYMENT_SERVICE, PaymentService } from '../services';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IPaymentConfigDTO>(PAYMENT_CONFIG_DTO).to(PaymentConfigDTO);
    bind<IPaymentConfigPresenter>(PAYMENT_CONFIG_PRESENTER).to(PaymentConfigPresenter);
    bind<IPaymentConfigService>(PAYMENT_CONFIG_SERVICE).to(PaymentConfigService);
    bind<IPaymentConfigRepository>(PAYMENT_CONFIG_REPOSITORY).to(PaymentConfigRepository);
    bind<IPaymentDTO>(PAYMENT_DTO).to(PaymentDTO);
    bind<IPaymentPresenter>(PAYMENT_PRESENTER).to(PaymentPresenter);
    bind<IPaymentService>(PAYMENT_SERVICE).to(PaymentService);
    bind<IPaymentRepository>(PAYMENT_REPOSITORY).to(PaymentRepository);
  });
};
