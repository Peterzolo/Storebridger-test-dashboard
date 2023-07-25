import { Router, Request, Response } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import { authenticate, imageUpload, validator } from '../../../library/middlewares';
import { postCreateImage, deleteImage } from '../controllers';

const imageRouter = Router();

imageRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Contract module working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Image health check successful', outcome).send(res);
  }),
);

imageRouter.post('/', authenticate, imageUpload('image'), tryCatcher(postCreateImage));

imageRouter.post('/delete', authenticate, validator(schema.destroyImage), tryCatcher(deleteImage));

export default imageRouter;
