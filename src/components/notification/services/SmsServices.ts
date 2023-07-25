import axios from 'axios';
import { inject, injectable } from 'inversify';
import { logger } from '../../../library/helpers';
import { ISmsDTO, ISendSms } from '../../../types/notification/sms/ISmsDTO';
import { ISmsService } from '../../../types/notification/sms/ISmsService';
import { SMS_DTO } from '../dtos';
import pubEventSmsSent from '../events/publishers/event.sms.sent';
import config from '../../../config';

export const SMS_SERVICE = Symbol('SmsService');

@injectable()
export class SmsService implements ISmsService {
  public constructor(@inject(SMS_DTO) private readonly smsDTO: ISmsDTO) {}

  send(payload: ISendSms): void {
    const dto = this.smsDTO.send(payload);
    const phoneNumber = this._intertionalizePhoneNumber(payload.recipient);
    this._sendSms({ message: `Phone verification token ${payload.content}`, reciever: phoneNumber }).then(() => {
      logger.info(JSON.stringify(dto));
      pubEventSmsSent({ phoneNumber: dto.recipient });
    });
  }

  private _intertionalizePhoneNumber(telephone: string, code = '234') {
    const arrangenumber = telephone.split('').reverse().join('').substring(0, 10).split('').reverse().join('');
    return `${code}${arrangenumber}`;
  }

  private async _sendSms({ message, reciever }: { message: string; reciever: string }) {
    try {
      const response = await axios.post(
        `${config.sendChamp.baseUrl}/sms/send`,
        { message, to: [reciever], sender_name: config.sendChamp.senderName, route: config.sendChamp.smsRoute },
        {
          headers: {
            Accept: 'application/json,text/plain,*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.sendChamp.apiKey}`,
          },
        },
      );

      logger.info(JSON.stringify(response.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error(JSON.stringify(e.message));
    }
  }
}
