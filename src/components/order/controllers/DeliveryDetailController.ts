import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { DELIVERY_DETAILS_SERVICE } from '../services';
import inversifyContainer from '../../../ioc/inversify.config';
import { IDeliveryDetailsService } from '../../../types/order';
import { i18n, translations } from '../../../locales/i18n';

const container = inversifyContainer();
const deliveryDetailsService = container.get<IDeliveryDetailsService>(DELIVERY_DETAILS_SERVICE);

class DeliveryDetailsController {
  public index = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const query = req.query;
    const outcome = await deliveryDetailsService.readMany(query);

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public show = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const orderId = req.params.id;
    const outcome = await deliveryDetailsService.read({ orderId });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  };

  public create = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await deliveryDetailsService.create({ ...req.body, createdByEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };

  public update = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = await deliveryDetailsService.update({ orderId: req.params.id }, { ...req.body });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  };
}

export const deliveryDetailsController = new DeliveryDetailsController();
