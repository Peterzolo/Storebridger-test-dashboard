import { SmsTemplate } from './Template';

export interface ISendSms {
  recipient: string;
  content: string;
  template: SmsTemplate;
}

export interface ISmsDTO {
  send(payload: ISendSms): ISendSms;
}
