import mongoose from 'mongoose';
import winston from 'winston';
import config from '../../../config';
import { logger } from '../../../library/helpers';

export class DbConnection {
  public static async initConnection(): Promise<void> {
    await DbConnection.connect(config.dbURI || '');
  }

  public static async connect(connStr: string): Promise<winston.Logger> {
    return mongoose
      .connect(
        connStr,
        //   {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   useFindAndModify: false,
        //   useCreateIndex: true,
        // }
      )
      .then(() =>
        logger.info(`
          >>>>>>>>>>>>>>>>>>>>>>
            DB is Connected
          >>>>>>>>>>>>>>>>>>>>>>
        `),
      )
      .catch((err) => logger.info(err));
  }

  public static setAutoReconnect(): void {
    mongoose.connection.on('disconnected', () => DbConnection.connect(config.dbURI || ''));
  }

  public static async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
