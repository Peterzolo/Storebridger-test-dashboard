import amqplib, { Message } from 'amqplib';
import config from '../../../../config/index';
import { IUser } from '../../../../types/user';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const queueName: EventName = 'query.user.get';

const pubQueryUserGet = async (query: Partial<IUser>) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!query) {
        reject(new BadRequestError('Query data is required to find user'));
      }

      const connection = await amqplib.connect(config.rabbitMQ.host);
      const channel = await connection.createChannel();
      const assertedQueue = await channel.assertQueue('', { durable: true, exclusive: true });
      const message = Buffer.from(JSON.stringify(query));

      channel.sendToQueue(queueName, message, {
        persistent: true,
        replyTo: assertedQueue.queue,
        correlationId: query.email,
        contentType: 'application/json',
      });

      channel.consume(
        assertedQueue.queue,
        async (message) => {
          if (message && message.properties.correlationId === query.email) {
            const user = JSON.parse(message.content.toString()) as IUser;
            resolve(user);
          }
          channel.ack(message as Message);
          setTimeout(() => {
            connection.close();
          }, config.rabbitMQ.closeConnectionTimeout);
        },
        { noAck: false },
      );
    } catch (error) {
      logger.error(`Error publishing pubQueryUserGet to ${queueName}: ${error}`);
      reject(error);
    }
  });
};

export default pubQueryUserGet;
