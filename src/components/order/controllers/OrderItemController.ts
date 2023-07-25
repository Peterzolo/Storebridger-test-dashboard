import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { IOrderItemService } from '../../../types/order';
import inversifyContainer from '../../../ioc/inversify.config';
import { ORDER_ITEM_SERVICE } from '../services/OrderItemService';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const orderItemService = container.get<IOrderItemService>(ORDER_ITEM_SERVICE);

class OrderItemController {
  public async index(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const orderId = req.params.id;
    const outcome = await orderItemService.readMany({ orderId });
    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  }

  public async create(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await orderItemService.create({ ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }

  public async update(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await orderItemService.update({ id: req.params.id }, { ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }

  public async delete(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await orderItemService.delete({ id: req.params.id });

    return new SuccessResponse(i18n.t(translations.common.responses.deleted), outcome).send(res);
  }
}

export const orderItemController = new OrderItemController();
