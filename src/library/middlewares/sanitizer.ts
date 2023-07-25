import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger, BadRequestError } from '../helpers';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
      logger.error(`${req.method} ${req.baseUrl}${req.url} => ${message}`);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };
