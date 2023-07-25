import 'reflect-metadata';
import 'source-map-support/register';

import { Application } from 'express';
import config from '../../config';
import inversifyConfig from '../../ioc/inversify.config';
import applicationConfig from '../../app/app';
import { DbConnection } from '../../databases/mongodb';
import { logger, initializeSocket } from '../../library/helpers';

initializeServer()
  .then(() => {
    logger.info(`
              ################################################
                ${config.appName} has been initialize
              ################################################
            `);
  })
  .catch((error: Error) => {
    logger.error(error);
    throw error;
  });
// }

async function initializeServer(): Promise<void> {
  inversifyConfig();

  const application: Application = applicationConfig();

  await DbConnection.initConnection();

  const serverInstance = application.listen(config.port, '0.0.0.0', () => {
    logger.info(`
      ################################################
        Express Server listening on port: ${config.port}
      ################################################
    `);
  });
  const io = initializeSocket(serverInstance);

  io.on('connection', async (client) => {
    logger.info(`Client connection opened`);

    client.on('disconnect', (event) => logger.info(`Client has disconnected ${event}`));
  });
}
