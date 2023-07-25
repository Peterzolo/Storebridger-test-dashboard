import { inject, injectable } from 'inversify';
import {
  ICreateOrderItem,
  ICreateOrderItems,
  IOrderItem,
  IOrderItemDTO,
  IOrderItemPresenter,
  IOrderItemRepository,
  IOrderItemService,
  IOrderRepository,
  IReadOrderItem,
  IUpdateOrderItem,
} from '../../../types/order';
import { ORDER_ITEM_DTO } from '../dtos';
import { ORDER_ITEM_REPOSITORY, ORDER_REPOSITORY } from '../repositories';
import { logger } from '../../../library/helpers';
import { ORDER_ITEM_PRESENTER } from '../presenters/OrderItemPresenter';
import { CONTRACT_CONTENT_TEMPLATE_REPOSITORY } from '../../contract/repositories/ContractContentTemplateRepository';
import { IContractContentTemplateRepository } from '../../../types/contract/IContractRepository';
import { IContractContentTemplate } from 'contract/IContract';
import { generateDefaultItemClauses } from '../utils/DefaultItemClauses';

export const ORDER_ITEM_SERVICE = Symbol('OrderItemService');

@injectable()
export class OrderItemService implements IOrderItemService {
  public constructor(
    @inject(ORDER_ITEM_DTO) private orderItemDTO: IOrderItemDTO,
    @inject(ORDER_ITEM_PRESENTER) private orderItemPresenter: IOrderItemPresenter,
    @inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
    @inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    @inject(CONTRACT_CONTENT_TEMPLATE_REPOSITORY)
    private readonly contractContentTemplateRepository: IContractContentTemplateRepository,
  ) {}

  public async createMany(payload: ICreateOrderItems): Promise<IOrderItem[]> {
    const orderItemDTO = this.orderItemDTO.createMany(payload);
    logger.info(`OrderService.createOrderItems orderItemDTO: ${JSON.stringify(orderItemDTO)}`);
    return await this.orderItemRepository.createMany(orderItemDTO as Array<IOrderItem>);
  }

  public async create(payload: ICreateOrderItem): Promise<IOrderItem> {
    const { contractId } = payload;
    const dto = this.orderItemDTO.create(payload) as IOrderItem;
    const orderItem = await this.orderItemRepository.create(dto);

    await this._updateClauses(contractId, orderItem);
    await this._updateOrderTotalQuantity(orderItem.orderId);

    return this.orderItemPresenter.serialize(orderItem as IOrderItem, []) as IOrderItem;
  }

  public async read(query: IReadOrderItem): Promise<Partial<IOrderItem> | null> {
    const orderItem = await this.orderItemRepository.findOne(query);
    return this.orderItemPresenter.serialize(orderItem as IOrderItem, []);
  }

  public async readMany(query: IReadOrderItem): Promise<Partial<IOrderItem>[]> {
    const orderItems = await this.orderItemRepository.find(query);

    return orderItems.map((orderItem) => this.orderItemPresenter.serialize(orderItem, []));
  }

  public async update(query: IReadOrderItem, payload: IUpdateOrderItem): Promise<Partial<IOrderItem>> {
    const { contractId, keepClauses } = payload;
    const dto = this.orderItemDTO.update(payload) as IOrderItem;
    const orderItem = (await this.orderItemRepository.update(query, dto)) as IOrderItem;

    if (!keepClauses) {
      await this._updateClauses(contractId, orderItem);
      await this._updateOrderTotalQuantity(orderItem.orderId);
    }

    return this.orderItemPresenter.serialize(orderItem as IOrderItem, []) as IOrderItem;
  }

  public async delete(query: IReadOrderItem): Promise<Partial<IOrderItem>> {
    const orderItem = await this.orderItemRepository.findOne({ id: query.id });

    if (!orderItem) return { id: query.id };

    await this.orderItemRepository.delete(String(query.id));

    await this._updateOrderTotalQuantity(orderItem.orderId);

    return this.orderItemPresenter.serialize(orderItem, ['id']);
  }

  private async _updateClauses(contractId: string, orderItem: IOrderItem) {
    const systemDefinedClauses = generateDefaultItemClauses({
      quantity: orderItem.quantity,
      condition: orderItem.condition,
    });

    const orderClauses = orderItem.description.split(',').map((str) => ({
      name: str,
      score: 0,
      isSystemDefined: false,
    }));

    const contractTemplate = (await this.contractContentTemplateRepository.findOne({
      contractId,
    })) as IContractContentTemplate;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const placeholders = Object.fromEntries(contractTemplate.placeholders as any) as any;
    placeholders.orderItemsClauses[orderItem.id] = {
      qty: orderItem.quantity,
      clauses: [...orderClauses, ...systemDefinedClauses],
    };

    await this.contractContentTemplateRepository.update({ contractId }, { placeholders });
  }

  private async _updateOrderTotalQuantity(orderId: string) {
    const orderItems = await this.readMany({ orderId });

    let totalPrice = 0;
    if (orderItems.length <= 0) {
      totalPrice = 0;
    } else {
      totalPrice = orderItems.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
    }
    await this.orderRepository.update({ id: orderId }, { totalQuantity: totalPrice });
  }
}
