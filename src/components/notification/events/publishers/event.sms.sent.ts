import amqplib from 'amqplib';
import config from '../../../../config/index';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'event.sms.sent';
const queueName: EventName = 'event.sms.sent';

const pubEventSmsSent = async (payload: { phoneNumber: string }) => {
  try {
    if (!payload) {
      throw new BadRequestError('Payload is required for sending sms');
    }
    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    const message = Buffer.from(JSON.stringify(payload));
    logger.info(`sms sent message event prepared: ${message}`);
    channel.publish(exchangeName, '', message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubEventSmsSent;
