import amqplib from 'amqplib';
import config from '../../../../config/index';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { ISendSms } from '../../../../types/notification';

const exchangeName: EventName = 'cmd.sms.send';
const queueName: EventName = 'cmd.sms.send';
const routingKey: EventName = 'cmd.sms.send';

const pubCMDSmsSend = async (payload: ISendSms) => {
  try {
    if (!payload) {
      throw new BadRequestError('Payload is required for sending sms');
    }

    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(payload));
    logger.info(`sms send message commad prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDSmsSend;
