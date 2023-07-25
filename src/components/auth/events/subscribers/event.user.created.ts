import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
// import { AUTH_SERVICE } from '../../services';
// import { IAuthService } from '../../../../library/types/auth';
import { ICreateUser } from '../../../../types/user';
// import inversifyContainer from '../../../../ioc/inversify.config';

// TODO: This file was created to show an example of how to subscribe to an event
// I do not see the need to sub to event.user.created but since it is the only other
// domain we have I had to do this here for reference. Once there's another domain like
// notification domain, we should remove this file
const exchangeName: EventName = 'event.user.created';
const queueName: EventName = 'event.user.created';
// const container = inversifyContainer();
// const authService = container.get<IAuthService>(AUTH_SERVICE);

const subEventUserCreated = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });
    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });

    channel.bindQueue(assertedQueue.queue, exchangeName, '');

    channel.consume(queueName, async (message) => {
      if (message) {
        const userPayload: ICreateUser = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(userPayload)}`);

        channel.ack(message as Message);

        // const outcome = await authService.created(userPayload);
        // logger.info(`User created: ${outcome}`);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subEventUserCreated;
