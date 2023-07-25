import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { inject, injectable } from 'inversify';
import { logger } from '../../../library/helpers';
import config from '../../../config';
import { IEmailDTO, ISendMail, IEmailService } from 'notification';
import { EMAIL_DTO } from '../dtos';

sgMail.setApiKey(config.sendgrid.apiKey);
export const EMAIL_SERVICE = Symbol('EmailService');

@injectable()
export class EmailService implements IEmailService {
  public constructor(@inject(EMAIL_DTO) private readonly emailDTO: IEmailDTO) {
    if (!config.sendgrid.apiKey) {
      logger.warn('Api key for EmailService is not set');
    }
  }

  public send(payload: ISendMail): void {
    const dto = this.emailDTO.send(payload);

    const msg: MailDataRequired = {
      to: dto.recipient,
      from: 'damiedev7@gmail.com',
      subject: 'Storebridger Mail Service',
      text: 'This is a basic email service and text will evolve once a template is created',
      html: dto.content,
    };

    sgMail
      .send(msg)
      .then(() => {
        logger.info('Email sent to user ', dto.recipient);
      })
      .catch((error) => {
        logger.error('Email not sent' + JSON.stringify(error.response.body.errors), error.response.body.errors);
      });
  }
}
