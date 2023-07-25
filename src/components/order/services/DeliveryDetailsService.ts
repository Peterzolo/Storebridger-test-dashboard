/* eslint-disable no-console */
import { inject, injectable } from 'inversify';
import { logger, NotFoundError } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';
import {
  ICreateDeliveryDetails,
  IDeliveryDetails,
  IDeliveryDetailsDTO,
  IDeliveryDetailsPresenter,
  IDeliveryDetailsRepository,
  IDeliveryDetailsService,
  IOrderService,
  IReadDeliverQuery,
  IReadDeliveryDetails,
  IUpdateDeliveryDetails,
} from '../../../types/order';
import { DELIVERY_DETAILS_DTO } from '../dtos';
import { IUser } from '../../../types/user';
import { DELIVERY_DETAILS_PRESENTER } from '../presenters';
import { DELIVERY_DETAILS_REPOSITORY } from '../repositories';
import { ORDER_SERVICE } from '../services';
import { USER_SERVICE } from '../../user/services/UserService';
import { IUserService } from '../../../types/user/IUserService';

export const DELIVERY_DETAILS_SERVICE = Symbol('DeliveryDetailsService');

@injectable()
export class DeliveryDetailsService implements IDeliveryDetailsService {
  public constructor(
    @inject(DELIVERY_DETAILS_DTO) private deliveryDetailsDTO: IDeliveryDetailsDTO,
    @inject(DELIVERY_DETAILS_PRESENTER) private readonly deliveryDetailsPresenter: IDeliveryDetailsPresenter,
    @inject(DELIVERY_DETAILS_REPOSITORY) private readonly deliveryDetailsRepository: IDeliveryDetailsRepository,
    @inject(ORDER_SERVICE) private readonly orderService: IOrderService,
    @inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  public async create(payload: ICreateDeliveryDetails): Promise<Partial<IDeliveryDetails>> {
    const createdBy = await this._getUser(payload.createdByEmail);

    const deliveryDetailsDTO = this.deliveryDetailsDTO.create({ ...payload, createdBy: createdBy.id || '' });
    logger.info(`deliveryDetails.createDeliveryDetails payloas ${JSON.stringify(deliveryDetailsDTO)}`);

    const order = await this.orderService.read({ id: payload.orderId });
    if (!order) throw new NotFoundError(i18n.t('order.errorResponse.notFound'));

    const deliveryDetails = (await this.deliveryDetailsRepository.create(
      deliveryDetailsDTO as IDeliveryDetails,
    )) as IDeliveryDetails;

    await this.orderService.addDeliveryDetails({ orderId: payload.orderId, deliveryDetailsId: deliveryDetails.id });

    return this.deliveryDetailsPresenter.serialize(deliveryDetails, []);
  }

  public async read(query: IReadDeliveryDetails): Promise<Partial<IDeliveryDetails>> {
    const deliveryDetails = (await this.deliveryDetailsRepository.findOne(query)) as IDeliveryDetails;
    return this.deliveryDetailsPresenter.serialize(deliveryDetails, []);
  }

  public async readMany(query: IReadDeliveryDetails): Promise<Partial<IDeliveryDetails>[]> {
    const deliveryDetails = (await this.deliveryDetailsRepository.find(query)) as IDeliveryDetails[];
    return deliveryDetails.map((detail: IDeliveryDetails) => this.deliveryDetailsPresenter.serialize(detail, []));
  }

  public async update(query: IReadDeliverQuery, payload: IUpdateDeliveryDetails): Promise<Partial<IDeliveryDetails>> {
    const dto = await this.deliveryDetailsDTO.update(payload);
    const deliverDetails = (await this.deliveryDetailsRepository.update(query, dto)) as IDeliveryDetails;

    return this.deliveryDetailsPresenter.serialize(deliverDetails, []);
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }
}
