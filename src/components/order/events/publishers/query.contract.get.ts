import amqplib, { Message } from 'amqplib';
import { IContract } from '../../../../types/contract';
import config from '../../../../config';
import { EventName } from '../../../../types/events';
import { BadRequestError, logger } from '../../../../library/helpers';

const queueName: EventName = 'query.contract.get';

const pubQueryContractGet = async (query: Partial<IContract>) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!query) {
        reject(new BadRequestError('Query data is required to find contract'));
      }

      const connection = await amqplib.connect(config.rabbitMQ.host);
      const channel = await connection.createChannel();
      const assertedQueue = await channel.assertQueue('', { durable: true, exclusive: true });
      const message = Buffer.from(JSON.stringify(query));

      channel.sendToQueue(queueName, message, {
        persistent: true,
        replyTo: assertedQueue.queue,
        correlationId: query.id,
        contentType: 'application/json',
      });

      channel.consume(
        assertedQueue.queue,
        async (message) => {
          if (message && message.properties.correlationId === query.id) {
            const contract = JSON.parse(message.content.toString()) as IContract;
            resolve(contract);
          }
          channel.ack(message as Message);
          setTimeout(() => {
            connection.close();
          }, config.rabbitMQ.closeConnectionTimeout);
        },
        {
          noAck: false,
        },
      );
    } catch (error) {
      logger.error(`Error publishing pubQueryContractGet to ${queueName}: ${error}`);
      reject(error);
    }
  });
};

export default pubQueryContractGet;
