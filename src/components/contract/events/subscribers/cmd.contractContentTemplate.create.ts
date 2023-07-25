import { Message, Connection } from 'amqplib';
import { IContractContentTemplateService, ICreateContractContentTemplate } from '../../../../types/contract';
import inversifyContainer from '../../../../ioc/inversify.config';
import { logger } from '../../../../library/helpers';
import { EventName } from '../../../../types/events';
import { CONTRACT_CONTENT_TEMPLATE_SERVICE } from '../../services';

const container = inversifyContainer();
const contractContentTemplateService = container.get<IContractContentTemplateService>(
  CONTRACT_CONTENT_TEMPLATE_SERVICE,
);
const exchangeName: EventName = 'cmd.contractContentTemplate.create';
const queueName: EventName = 'cmd.contractContentTemplate.create';
const pattern: EventName = 'cmd.contractContentTemplate.create';

const subCMDContractContentTemplateCreate = async (connection: Connection) => {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    const assertedQueue = await channel.assertQueue(queueName, { exclusive: true });
    channel.bindQueue(assertedQueue.queue, exchangeName, pattern);

    channel.consume(queueName, async (message) => {
      if (message) {
        const contractContentTemplatePayload: ICreateContractContentTemplate = JSON.parse(message.content.toString());
        logger.info(`${exchangeName} received with this payload ${JSON.stringify(contractContentTemplatePayload)}`);

        channel.ack(message as Message);

        const outcome = await contractContentTemplateService.create(contractContentTemplatePayload);
        logger.info(`ContractContentTemplate created: ${JSON.stringify(outcome)}`);
      } else {
        logger.info(`${exchangeName} received with no message`);
      }
    });
  } catch (error) {
    logger.error(`Error subscribing to ${exchangeName} from ${queueName}: ${error}`);
  }
};

export default subCMDContractContentTemplateCreate;
