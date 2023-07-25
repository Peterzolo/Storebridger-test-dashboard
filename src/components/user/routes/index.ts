import { Router, Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { userController } from '../controllers';
import { tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import { authenticate, validator } from '../../../library/middlewares';

const userRouter = Router();

// Unprotected User routes
userRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `User module working on ${process.env.APP_NAME}` };

    return new SuccessResponse('User Route connected', outcome).send(res);
  }),
);

userRouter.get('/current-user', authenticate, tryCatcher(userController.getCurrentUser));

userRouter.get('/', authenticate, tryCatcher(userController.index));

userRouter.post('/search', authenticate, validator(schema.searchUser), tryCatcher(userController.searchUser));

export default userRouter;
