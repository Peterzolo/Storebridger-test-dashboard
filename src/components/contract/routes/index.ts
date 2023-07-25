import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import {
  contractController,
  getContractCategories,
  postCreateContractCategory,
  readDrafts,
  createDraft,
} from '../controllers';
import { authenticate, validator } from '../../../library/middlewares';

const contractRouter = Router();

contractRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Contract module working on ${process.env.APP_NAME}` };

    return new SuccessResponse('Signup successfull', outcome).send(res);
  }),
);

contractRouter.get('/', authenticate, tryCatcher(contractController.index));
contractRouter.post('/', authenticate, tryCatcher(contractController.create));
contractRouter.get('/drafts', authenticate, tryCatcher(readDrafts));
contractRouter.get('/:id', authenticate, tryCatcher(contractController.read));
contractRouter.put('/:id', authenticate, tryCatcher(contractController.update));

contractRouter.post(
  '/category',
  authenticate,
  validator(schema.createContractCategory),
  tryCatcher(postCreateContractCategory),
);

contractRouter.post(
  '/sign-contract',
  authenticate,
  validator(schema.signContract),
  tryCatcher(contractController.signContract),
);

contractRouter.post(
  '/accept-contract-invitation',
  authenticate,
  validator(schema.acceptContractInvitation),
  tryCatcher(contractController.acceptContractInvitation),
);
contractRouter.post(
  '/invite-recipient',
  authenticate,
  validator(schema.inviteRecipient),
  tryCatcher(contractController.inviteRecipient),
);

contractRouter.get('/category', authenticate, tryCatcher(getContractCategories));
contractRouter.get('/:contractId/placeholder', authenticate, tryCatcher(contractController.contractContentTemplate));
contractRouter.put(
  '/:contractId/placeholder',
  authenticate,
  tryCatcher(contractController.updateContractContentTemplate),
);

contractRouter.post('/appeal', authenticate, tryCatcher(contractController.raiseComplaint));
contractRouter.post('/draft', authenticate, validator(schema.createDraftContract), tryCatcher(createDraft));

export default contractRouter;
