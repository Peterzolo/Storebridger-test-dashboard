import { ISendSms } from './ISmsDTO';

export interface ISmsService {
  send(payload: ISendSms): void;
}
