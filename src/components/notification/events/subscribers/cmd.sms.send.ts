import { Message, Connection } from 'amqplib';
import inversifyContainer from '../../../../ioc/inversify.config';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ISendSms, ISmsService } from '../../../../types/notification/sms';
import { SMS_SERVICE } from '../../services';

const container = inversifyContainer();
const smsService = container.get<ISmsService>(SMS_SERVICE);
const exchangeName: EventName = 'cmd.sms.send';
const queueName: EventName = 'cmd.sms.send';
const pattern: EventName = 'cmd.sms.send';

const subCMDEmailSend = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const payload: ISendSms = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(payload)}`);

        smsService.send(payload);

        channel.ack(message as Message);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subCMDEmailSend;
