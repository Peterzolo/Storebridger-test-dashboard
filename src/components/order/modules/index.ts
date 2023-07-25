import { ContainerModule, interfaces } from 'inversify';
import {
  IDeliveryDetailsDTO,
  IDeliveryDetailsPresenter,
  IDeliveryDetailsRepository,
  IDeliveryDetailsService,
  IOrderContractContentTemplateDTO,
  IOrderDTO,
  IOrderItemDTO,
  IOrderItemPresenter,
  IOrderItemRepository,
  IOrderItemService,
  IOrderPresenter,
  IOrderRepository,
  IOrderService,
} from '../../../types/order';
import { DELIVERY_DETAILS_SERVICE, DeliveryDetailsService, ORDER_SERVICE, OrderService } from '../services';
import {
  DELIVERY_DETAILS_REPOSITORY,
  DeliveryDetailsRepository,
  ORDER_ITEM_REPOSITORY,
  ORDER_REPOSITORY,
  OrderItemRepository,
  OrderRepository,
} from '../repositories';
import {
  CONTRACT_CONTENT_TEMPLATE_DTO,
  ContractContentTemplateDTO,
  DELIVERY_DETAILS_DTO,
  DeliveryDetailsDTO,
  ORDER_DTO,
  ORDER_ITEM_DTO,
  OrderDTO,
  OrderItemDTO,
} from '../dtos';
import { DELIVERY_DETAILS_PRESENTER, DeliveryDetailsPresenter, ORDER_PRESENTER, OrderPresenter } from '../presenters';
import { ORDER_ITEM_SERVICE, OrderItemService } from '../services/OrderItemService';
import { ORDER_ITEM_PRESENTER, OrderItemPresenter } from '../presenters/OrderItemPresenter';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IOrderService>(ORDER_SERVICE).to(OrderService).inSingletonScope();
    bind<IOrderRepository>(ORDER_REPOSITORY).to(OrderRepository);
    bind<IOrderItemService>(ORDER_ITEM_SERVICE).to(OrderItemService).inSingletonScope();
    bind<IOrderItemPresenter>(ORDER_ITEM_PRESENTER).to(OrderItemPresenter);
    bind<IOrderItemRepository>(ORDER_ITEM_REPOSITORY).to(OrderItemRepository);
    bind<IOrderDTO>(ORDER_DTO).to(OrderDTO);
    bind<IOrderItemDTO>(ORDER_ITEM_DTO).to(OrderItemDTO);
    bind<IOrderContractContentTemplateDTO>(CONTRACT_CONTENT_TEMPLATE_DTO).to(ContractContentTemplateDTO);
    bind<IOrderPresenter>(ORDER_PRESENTER).to(OrderPresenter);
    bind<IDeliveryDetailsDTO>(DELIVERY_DETAILS_DTO).to(DeliveryDetailsDTO);
    bind<IDeliveryDetailsRepository>(DELIVERY_DETAILS_REPOSITORY).to(DeliveryDetailsRepository);
    bind<IDeliveryDetailsService>(DELIVERY_DETAILS_SERVICE).to(DeliveryDetailsService).inSingletonScope();
    bind<IDeliveryDetailsPresenter>(DELIVERY_DETAILS_PRESENTER).to(DeliveryDetailsPresenter);
  });
};
