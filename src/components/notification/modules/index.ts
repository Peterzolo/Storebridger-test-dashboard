import { ContainerModule, interfaces } from 'inversify';
import { IEmailDTO, IEmailService, ISmsDTO, ISmsService } from '../../../types/notification';
import { EmailDTO, EMAIL_DTO, SmsDTO, SMS_DTO } from '../dtos';
import { EmailService, EMAIL_SERVICE, SmsService, SMS_SERVICE } from '../services';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IEmailDTO>(EMAIL_DTO).to(EmailDTO);
    bind<IEmailService>(EMAIL_SERVICE).to(EmailService);
    bind<ISmsDTO>(SMS_DTO).to(SmsDTO);
    bind<ISmsService>(SMS_SERVICE).to(SmsService);
  });
};
