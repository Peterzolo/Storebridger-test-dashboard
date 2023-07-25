import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import {
  getConfirmEmail,
  getConfirmPasswordReset,
  getConfirmPhone,
  postCompletePasswordReset,
  postCompleteSignup,
  postForgotPassword,
  postGoogleLogin,
  postLogin,
  postLogout,
  postRefreshToken,
  postSignup,
  postVerifyPhone,
} from '../controllers';
import { authenticate, ValidationSource, validator } from '../../../library/middlewares';

const userRouter = Router();

userRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Auth module working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Signup successfull', outcome).send(res);
  }),
);

userRouter.post('/signup', validator(schema.signup), tryCatcher(postSignup));

userRouter.get('/confirm-signup', validator(schema.token, ValidationSource.QUERY), tryCatcher(getConfirmEmail));

userRouter.post('/verify-phone', validator(schema.verifyPhone), tryCatcher(postVerifyPhone));

userRouter.get('/confirm-phone', validator(schema.token, ValidationSource.QUERY), tryCatcher(getConfirmPhone));

userRouter.post('/complete-signup', validator(schema.completeSignup), tryCatcher(postCompleteSignup));

userRouter.post('/login', validator(schema.login), tryCatcher(postLogin));

userRouter.get('/token/refresh', tryCatcher(postRefreshToken));

userRouter.post('/logout', authenticate, tryCatcher(postLogout));

userRouter.post('/forgot-password', validator(schema.forgotPassword), tryCatcher(postForgotPassword));

userRouter.get(
  '/confirm-password-reset',
  validator(schema.token, ValidationSource.QUERY),
  tryCatcher(getConfirmPasswordReset),
);

userRouter.post(
  '/complete-password-reset',
  validator(schema.confirmPasswordReset),
  validator(schema.token, ValidationSource.QUERY),
  tryCatcher(postCompletePasswordReset),
);
userRouter.post('/google/login', validator(schema.googleLogin), tryCatcher(postGoogleLogin));

export default userRouter;
