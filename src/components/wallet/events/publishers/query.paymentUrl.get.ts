import amqplib, { Message } from 'amqplib';
import { IPaymentInitiate } from 'payment';
import config from '../../../../config/index';
import { BadRequestError, logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';

const queueName: EventName = 'query.paymentUrl.get';

const pubQueryPaymentUrlGet = async (query: IPaymentInitiate) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!query) {
        reject(new BadRequestError(`Query data is required to generate payment url`));
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

      channel.consume(assertedQueue.queue, async (message) => {
        if (message) {
          const paymentUrl = JSON.parse(message.content.toString());
          resolve(paymentUrl);
        }
        channel.ack(message as Message);
        setTimeout(() => {
          connection.close();
        }, config.rabbitMQ.closeConnectionTimeout);
      });
    } catch (error) {
      logger.error(`Error publishing pubQueryPaymentUrlGet to ${queueName}: ${error}`);
      reject(error);
    }
  });
};

export default pubQueryPaymentUrlGet;
