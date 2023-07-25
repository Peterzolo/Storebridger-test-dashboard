import amqplib from 'amqplib';
import config from '../../../../config/index';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ISendMail } from '../../../../types/notification';

const exchangeName: EventName = 'cmd.email.send';
const queueName: EventName = 'cmd.email.send';
const routingKey: EventName = 'cmd.email.send';

const pubCMDEmailSend = async (payload: ISendMail) => {
  try {
    if (!payload) {
      throw new BadRequestError('Payload is required for sending email');
    }

    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(payload));
    logger.info(`email send message commad prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDEmailSend;
