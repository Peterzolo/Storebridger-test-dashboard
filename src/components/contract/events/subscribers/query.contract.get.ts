import { Message, Connection } from 'amqplib';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { CONTRACT_SERVICE } from '../../services';
import { IContractService } from '../../../../types/contract';
import inversifyContainer from '../../../../ioc/inversify.config';

const queueName: EventName = 'query.contract.get';
const container = inversifyContainer();
const contractService = container.get<IContractService>(CONTRACT_SERVICE);

const subQueryContractGet = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);

    channel.consume(queueName, async (message) => {
      if (message) {
        const contract = await contractService.read({ id: message.properties.correlationId });
        const responseMessage = Buffer.from(JSON.stringify(contract));
        channel.sendToQueue(message?.properties.replyTo, responseMessage, {
          correlationId: message?.properties.correlationId,
        });
      }
      channel.ack(message as Message);
    });
  } catch (error) {
    logger.error(`Error subscribing to QueryContractGet from ${queueName}: ${error}`);
  }
};

export default subQueryContractGet;
