import amqplib from 'amqplib';
import config from '../../../../config/index';
import { IUser } from '../../../../types/user';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'event.user.created';
const queueName: EventName = 'event.user.created';

const pubEventUserCreated = async (userPayload: IUser) => {
  try {
    if (!userPayload) {
      throw new BadRequestError('User data is required to emit user created event');
    }

    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    const message = Buffer.from(JSON.stringify(userPayload));
    logger.info(`user created message event prepared: ${message}`);
    channel.publish(exchangeName, '', message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubEventUserCreated;
