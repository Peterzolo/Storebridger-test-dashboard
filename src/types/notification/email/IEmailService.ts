import { ISendMail } from './IEmailDTO';

export interface IEmailService {
  send(payload: ISendMail): void;
}
