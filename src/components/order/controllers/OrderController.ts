import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { ORDER_SERVICE } from '../services';
import { IOrderItemService, IOrderService } from '../../../types/order';
import inversifyContainer from '../../../ioc/inversify.config';
import { ORDER_ITEM_SERVICE } from '../services/OrderItemService';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const orderService = container.get<IOrderService>(ORDER_SERVICE);
const orderItemService = container.get<IOrderItemService>(ORDER_ITEM_SERVICE);

class OrderController {
  public index = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.readMany({ query: req.query, userEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public create = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.create({ ...req.body, createdByEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };

  public read = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.read({ id: req.params.id });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public readByContract = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.read({ contractId: req.params.id });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public update = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.update({ id: req.params.id }, { ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };

  public getOrderItems = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const orderId = req.params.id;
    const outcome = await orderItemService.readMany({ orderId });
    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public addOrderItem = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderItemService.create({ ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };

  public editOrderItem = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderItemService.update({ id: req.params.id }, { ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };

  public deleteOrderItem = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderItemService.delete({ id: req.params.id });

    return new SuccessResponse(i18n.t(translations.common.responses.deleted), outcome).send(res);
  };

  public editRole = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await orderService.editRole({
      contractId: req.params.id,
      userEmail: req.email,
    });

    return new SuccessResponse(i18n.t(translations.common.responses.deleted), outcome).send(res);
  };
}

export const orderController = new OrderController();
