import { Request, Response } from 'express';
import { USER_SERVICE } from '../services';
import { IUserService } from '../../../types/user';
import { SuccessResponse } from '../../../library/helpers';
import inversifyContainer from '../../../ioc/inversify.config';

const container = inversifyContainer();
const userService = container.get<IUserService>(USER_SERVICE);

class UserController {
  public async index(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const query = req.query;
    const outcome = await userService.readMany(query);
    return new SuccessResponse('User Fectched', outcome).send(res);
  }

  public async getCurrentUser(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await userService.read({ email: req.email });

    return new SuccessResponse('User Fectched', outcome).send(res);
  }

  public async searchUser(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await userService.search({ email: req.body.email });

    return new SuccessResponse('User Search', outcome).send(res);
  }
}

export const userController = new UserController();
