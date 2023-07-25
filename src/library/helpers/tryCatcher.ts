import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response<unknown, Record<string, unknown>>>;

export default (execution: AsyncFunction) =>
  (req: Request, res: Response, next: NextFunction): Promise<void | Response<unknown, Record<string, unknown>>> =>
    execution(req, res, next).catch(next);
