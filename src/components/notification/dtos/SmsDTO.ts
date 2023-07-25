import { injectable } from 'inversify';
import { ISmsDTO } from '../../../types/notification';
import { ISendSms } from '../../../types/notification';

export const SMS_DTO = Symbol('SmsDTO');

@injectable()
export class SmsDTO implements ISmsDTO {
  public send(payload: ISendSms): ISendSms {
    const { recipient, content, template } = payload;
    return {
      recipient,
      content,
      template,
    };
  }
}
