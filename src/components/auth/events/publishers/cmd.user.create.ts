import amqplib from 'amqplib';
import config from '../../../../config/index';
import { IUser } from '../../../../types/user';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const exchangeName: EventName = 'cmd.user.create';
const queueName: EventName = 'cmd.user.create';
const routingKey: EventName = 'cmd.user.create';

const pubCMDUserCreate = async (userPayload: Partial<IUser>) => {
  try {
    if (!userPayload) {
      throw new BadRequestError('User data is required for user creation');
    }

    const connection = await amqplib.connect(config.rabbitMQ.host);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const message = Buffer.from(JSON.stringify(userPayload));
    logger.info(`user create message commad prepared: ${message}`);
    channel.publish(exchangeName, routingKey, message);

    setTimeout(() => {
      connection.close();
    }, config.rabbitMQ.closeConnectionTimeout);
  } catch (error) {
    logger.error(`Error publishing ${exchangeName} to ${queueName}: ${error}`);
  }
};

export default pubCMDUserCreate;
