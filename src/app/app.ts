/* eslint-disable no-console */
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from './routes';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { logger, NotFoundError, ApiError, InternalError } from '../library/helpers';
import express, { Application, Request, Response, NextFunction } from 'express';
import { engine } from 'express-handlebars';
import path from 'path';

export default (): Application => {
  process.on('uncaughtException', (e) => {
    logger.error(e);
  });

  const app = express();

  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'https://storebridger-frontend.herokuapp.com',
        'https://app-storebridger.herokuapp.com',
      ],
      credentials: true,
      exposedHeaders: ['set-cookie'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Set-Cookie',
      ],
    }),
  );
  app.use(methodOverride());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.json({ limit: '2mb' }));
  app.use(
    express.urlencoded({
      limit: '2mb',
      extended: true,
    }),
  );
  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  app.set('views', './src/views');
  app.use(cookieParser());
  app.use(helmet());
  app.set('trust proxy', 1);
  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => next(new NotFoundError()));

  // Middleware Error Handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${JSON.stringify(err)}`);
    if (err instanceof ApiError) {
      console.log(err);
      return ApiError.handle(err, res);
    } else {
      console.log(err);
      if (process.env.NODE_ENV === 'development') {
        logger.error(err);
        return res.status(500).send(err.message);
      }
      return ApiError.handle(new InternalError(), res);
    }
  });

  return app;
};
