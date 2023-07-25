import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ISendMail } from '../../../../types/notification/email/IEmailDTO';

const exchangeName: EventName = 'event.email.sent';
const queueName: EventName = 'event.email.sent';

const subEventEmailSent = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });
    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });

    channel.bindQueue(assertedQueue.queue, exchangeName, '');

    channel.consume(queueName, async (message) => {
      if (message) {
        const payload: ISendMail = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(payload)}`);

        channel.ack(message as Message);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subEventEmailSent;
