export interface ISendMail {
  recipient: string;
  subject?: string;
  content?: string;
  text?: string;
}

export interface IEmailDTO {
  send(payload: ISendMail): ISendMail;
}
