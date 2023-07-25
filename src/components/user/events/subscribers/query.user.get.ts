import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { USER_SERVICE } from '../../services';
import { IUserService } from '../../../../types/user';
import inversifyContainer from '../../../../ioc/inversify.config';

const queueName: EventName = 'query.user.get';
const container = inversifyContainer();
const userService = container.get<IUserService>(USER_SERVICE);

const subQueryUserGet = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);

    channel.consume(queueName, async (message) => {
      if (message) {
        const user = await userService.read({ email: message.properties.correlationId });
        const responseMessage = Buffer.from(JSON.stringify(user));
        channel.sendToQueue(message?.properties.replyTo, responseMessage, {
          correlationId: message?.properties.correlationId,
        });
      }
      channel.ack(message as Message);
    });
  } catch (error) {
    logger.error(`Error subscribing to QueryUserGet from ${queueName}: ${error}`);
  }
};

export default subQueryUserGet;
