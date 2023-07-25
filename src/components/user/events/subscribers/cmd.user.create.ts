import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { USER_SERVICE } from '../../services';
import { IUserService, ICreateUser } from '../../../../types/user';
import inversifyContainer from '../../../../ioc/inversify.config';

const container = inversifyContainer();
const userService = container.get<IUserService>(USER_SERVICE);
const exchangeName: EventName = 'cmd.user.create';
const queueName: EventName = 'cmd.user.create';
const pattern: EventName = 'cmd.user.create';

const subCMDUserCreate = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const userPayload: ICreateUser = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(userPayload)}`);

        channel.ack(message as Message);

        const outcome = await userService.create(userPayload);
        logger.info(`User created: ${JSON.stringify(outcome)}`);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subCMDUserCreate;
