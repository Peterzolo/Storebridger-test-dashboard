import { injectable } from 'inversify';
import { lowerCase } from '../../../library/helpers';
import { IEmailDTO, ISendMail } from '../../../types/notification';

export const EMAIL_DTO = Symbol('EmailDTO');

@injectable()
export class EmailDTO implements IEmailDTO {
  public send(payload: ISendMail): ISendMail {
    const { recipient, content, subject } = payload;

    return {
      recipient: lowerCase(recipient),
      content,
      subject,
    };
  }
}
