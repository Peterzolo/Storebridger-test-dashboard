import { Message, Connection } from 'amqplib';
import inversifyContainer from '../../../../ioc/inversify.config';
import { IEmailService } from '../../../../types/notification';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ISendMail } from '../../../../types/notification/email/IEmailDTO';
import { EMAIL_SERVICE } from '../../services';

const container = inversifyContainer();
const mailService = container.get<IEmailService>(EMAIL_SERVICE);
const exchangeName: EventName = 'cmd.email.send';
const queueName: EventName = 'cmd.email.send';
const pattern: EventName = 'cmd.email.send';

const subCMDEmailSend = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const payload: ISendMail = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(payload)}`);

        mailService.send(payload);

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
