import { inject, injectable } from 'inversify';
import {
  ICreateOrder,
  ICreateOrderItems,
  ICreateRecipient,
  IOrder,
  IOrderContractContentTemplateDTO,
  IOrderDTO,
  IOrderItemService,
  IOrderPresenter,
  IOrderRepository,
  IOrderService,
  IReadOrder,
} from '../../../types/order';
import { CONTRACT_CONTENT_TEMPLATE_DTO, ORDER_DTO } from '../dtos';
import { ORDER_REPOSITORY } from '../repositories';
import { ORDER_PRESENTER } from '../presenters';
import { IUser } from '../../../types/user';
import { BadRequestError, logger, NotFoundError } from '../../../library/helpers';
import { i18n, translations } from '../../../locales/i18n';
import { IContract, IContractContentTemplate } from '../../../types/contract';
import { UpdateQuery } from 'mongoose';
import { ORDER_ITEM_SERVICE } from './OrderItemService';
import { USER_SERVICE } from '../../user/services/UserService';
import { IUserService } from '../../../types/user/IUserService';
import { CONTRACT_REPOSITORY } from '../../contract/repositories/ContractRepository';
import { IContractContentTemplateRepository, IContractRepository } from '../../../types/contract/IContractRepository';
import { CONTRACT_CONTENT_TEMPLATE_REPOSITORY } from '../../contract/repositories';
import _ from 'lodash';
import { WALLET_ENTRY_REPOSITORY, WALLET_REPOSITORY } from '../../../components/wallet/repositories';
import { IWallet, IWalletEntryRepository, IWalletEntryStatus, IWalletRepository } from '../../../types/wallet';
import { OrderStatus } from '../../../constants';

export const ORDER_SERVICE = Symbol('OrderService');

@injectable()
export class OrderService implements IOrderService {
  public constructor(
    @inject(ORDER_DTO) private orderDTO: IOrderDTO,
    @inject(CONTRACT_CONTENT_TEMPLATE_DTO) private contractContentTemplateDTO: IOrderContractContentTemplateDTO,
    @inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    @inject(WALLET_ENTRY_REPOSITORY) private readonly walletEntryRepostory: IWalletEntryRepository,
    @inject(WALLET_REPOSITORY) private readonly walletRepository: IWalletRepository,
    @inject(ORDER_PRESENTER) private readonly orderPresenter: IOrderPresenter,
    @inject(ORDER_ITEM_SERVICE) private orderItemService: IOrderItemService,
    @inject(USER_SERVICE) private readonly userService: IUserService,
    @inject(CONTRACT_REPOSITORY) private readonly contractRepository: IContractRepository,
    @inject(CONTRACT_CONTENT_TEMPLATE_REPOSITORY)
    private readonly contractContentTemplateRepository: IContractContentTemplateRepository,
  ) {}

  public async create(payload: ICreateOrder): Promise<Partial<IOrder>> {
    const createdBy = await this._getUser(payload.createdByEmail);

    const orderDTO = this.orderDTO.create({
      ...payload,
      createdBy: createdBy.id || '',
      ...this._getSellerOrBuyerId(payload.authorRole, createdBy.id || ''),
    });

    logger.info(`OrderService.createOrder payload: ${JSON.stringify(orderDTO)}`);

    const contract = await this._getContract(payload.contractId);
    logger.info(`OrderService.contract id payload: ${JSON.stringify(contract)}`);

    if (!contract) throw new NotFoundError(i18n.t('contract.findContract.errorResponses.notFound'));

    const order = await this.orderRepository.findOne({ contractId: payload.contractId });
    logger.info(`OrderService.order id payload: ${JSON.stringify(order)}`);

    if (order) throw new BadRequestError(i18n.t('order.createOrder.errorResponses.orderExists'));

    const createdOrder = (await this.orderRepository.create(orderDTO as IOrder)) as IOrder;

    const orderItems = await this.orderItemService.createMany({
      orderItems: orderDTO.orderItems,
      orderId: createdOrder.id,
    } as ICreateOrderItems);
    logger.info(`OrderService.createOrder orderItems: ${JSON.stringify(orderItems)}`);

    const contractTemplateDTO = this.contractContentTemplateDTO.create({
      contractId: orderDTO.contractId || '',
      placeholders: {
        orderItems: orderItems,
        orderId: createdOrder.id,
        orderTotalAmount: createdOrder.totalAmount,
        contractType: 'GOODS || SERVICES ',
        authorCountryOfRecidence: 'NIGERIA',
        ...this._getSellerOrBuyerId(payload.authorRole, createdBy.id || ''),
      },
    }) as IContractContentTemplate;

    await this.contractContentTemplateRepository.create(contractTemplateDTO);

    return this.orderPresenter.serialize(createdOrder, [
      'id',
      'avatar',
      'title',
      'contractId',
      'totalAmount',
      'buyerId',
      'sellerId',
      'totalQuantity',
      'createdAt',
      'deliveryDetailsId',
      'status',
    ]);
  }

  public async update(query: IReadOrder, update: UpdateQuery<IOrder>): Promise<Partial<IOrder> | null> {
    const order = await this.orderRepository.update(query, update);

    if (update.status === OrderStatus.COMPLETE) {
      this._updateUpcomingPayment({ contractId: order?.contractId || '' });
    }
    return this.orderPresenter.serialize(order as IOrder, [
      'id',
      'avatar',
      'title',
      'contractId',
      'totalAmount',
      'buyerId',
      'sellerId',
      'totalQuantity',
      'createdAt',
      'deliveryDetailsId',
      'status',
    ]);
  }

  public async read(query: Record<string, unknown>): Promise<Partial<IOrder> | null> {
    const order = await this.orderRepository.findOne(query);

    if (!order) {
      return null;
    }

    return this.orderPresenter.serialize(order, [
      'id',
      'avatar',
      'title',
      'contractId',
      'totalAmount',
      'buyerId',
      'sellerId',
      'totalQuantity',
      'createdAt',
      'deliveryDetailsId',
      'status',
    ]);
  }

  public async readMany(payload: { query: IReadOrder; userEmail: string }): Promise<Partial<IOrder>[]> {
    const { query, userEmail } = payload;
    const user = await this._getUser(userEmail);
    let orderList: IOrder[] = [];

    if (!_.isEmpty(query)) {
      if (_.has(query, 'ids')) {
        const ids = query.ids?.split(',');
        const queryObj = { ids };
        orderList = await this.orderRepository.findByIdList(queryObj);
      } else if (_.has(query, 'contractIds')) {
        const contractIds = query.contractIds?.split(',');
        const queryObj = {
          field: 'contractId',
          value: contractIds,
        };
        orderList = await this.orderRepository.findByPropertyList(queryObj);
      } else {
        orderList = await this.orderRepository.find(query);
      }
    } else {
      const sellOrders = await this.orderRepository.find({ ...query, sellerId: user.id });
      const buyOrders = await this.orderRepository.find({ ...query, buyerId: user.id });
      orderList = [...sellOrders, ...buyOrders];
    }

    return orderList.map((order: IOrder) =>
      this.orderPresenter.serialize(order, [
        'id',
        'avatar',
        'title',
        'contractId',
        'totalAmount',
        'buyerId',
        'sellerId',
        'totalQuantity',
        'createdAt',
        'deliveryDetailsId',
        'status',
      ]),
    );
  }

  public async createRecipient(payload: ICreateRecipient): Promise<Partial<IOrder>> {
    const order = await this.read({ contractId: payload.contractId });

    if (!order) throw new BadRequestError(i18n.t('order.createOrder.errorResponses.orderExists'));

    const orderRecipientDTO = this.orderDTO.createRecipient({
      order,
      contractId: payload.contractId,
      recipientId: payload.recipientId,
    });

    logger.info(`order recipient DTO ${JSON.stringify(orderRecipientDTO)}`);

    const query = { contractId: orderRecipientDTO.contractId };
    const update = orderRecipientDTO;

    logger.info(`update order data ${JSON.stringify(update)}`);

    const updatedOrder = await this.update(query, update);

    if (!updatedOrder) throw new BadRequestError(i18n.t('order.createOrder.errorResponses.orderExists'));

    return updatedOrder;
  }

  public delete(id: string): Promise<Partial<IOrder> | null> {
    logger.info(id);
    throw new Error('Method not implemented.');
  }

  public async addDeliveryDetails(payload: { orderId: string; deliveryDetailsId: string }): Promise<Partial<IOrder>> {
    const query = { id: payload.orderId };
    const update = { deliveryDetailsId: payload.deliveryDetailsId };

    const order = await this.update(query, update);

    if (!order) throw new NotFoundError('Order not found');

    return this.orderPresenter.serialize(order as IOrder, ['id', 'contractId', 'deliveryDetailsId']);
  }

  public async editRole(payload: { contractId: string; userEmail: string }): Promise<Partial<IOrder> | null> {
    logger.info('initiated edit role service');
    const { contractId, userEmail } = payload;

    const currentUser = await this._getUser(userEmail);

    if (!currentUser) throw new NotFoundError(i18n.t(translations.user.notFound));

    const currentContract = await this._getContract(contractId);

    if (!currentContract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));

    const currentOrder = await this.read({ contractId: currentContract.id });

    if (!currentOrder) throw new NotFoundError(i18n.t(translations.order.errorResponses.notFound));

    if (currentContract.status === 'COMPLETED')
      throw new BadRequestError(translations.contract.responses.notAllowedAccess);

    if (currentContract.authorId !== currentUser.id)
      throw new BadRequestError(translations.contract.responses.notAllowedAccess);

    const updatedOrder = await this.update(
      { contractId: currentContract.id },
      currentUser.id === currentOrder.buyerId
        ? { buyerId: currentContract.recipientId, sellerId: currentUser.id }
        : { sellerId: currentContract.recipientId, buyerId: currentUser.id },
    );

    const contractTemplate = await this.contractContentTemplateRepository.findOne({ contractId: currentContract.id });
    if (!contractTemplate)
      throw new NotFoundError(i18n.t(translations.contract.responses.contractContentTemplateNotFound));

    contractTemplate.set('placeholders.buyerId', `${currentOrder.sellerId}`);
    contractTemplate.set('placeholders.sellerId', `${currentOrder.buyerId}`);

    return updatedOrder;
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }

  private async _getContract(id: string): Promise<Partial<IContract> | null> {
    const contract = await this.contractRepository.findOne({ id });

    return contract as Partial<IContract> | null;
  }

  private _getSellerOrBuyerId(authorRole: string, authorId: string): Record<string, string> {
    if (authorRole === 'BUYER') return { buyerId: authorId };
    if (authorRole === 'SELLER') return { sellerId: authorId };

    return {};
  }

  private async _updateUpcomingPayment(payload: { contractId: string }): Promise<IWallet | null> {
    const { contractId } = payload;
    logger.info(`update upcoming payment payload ${JSON.stringify(payload)}`);

    const walletEntry = await this.walletEntryRepostory.findOne({ contractId });
    logger.info(`walletEntry response ${JSON.stringify(walletEntry)}`);

    if (!walletEntry) throw new NotFoundError(i18n.t(translations.walletEntry.responses.getWalletEntry.notFound));

    const wallet = await this.walletRepository.findOne({ userId: walletEntry.userId });

    if (!wallet) throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));

    const balance = Number(wallet.balance) + Number(walletEntry.credit);
    logger.info(`update balance ${JSON.stringify(balance)}`);

    const updateWalletEntryQuery = { contractId, status: IWalletEntryStatus.UPCOMING };
    const updateWalletEntry = {
      status: IWalletEntryStatus.PROCESSED,
      balance: balance,
    };

    logger.info(`update wallet entry ${JSON.stringify(updateWalletEntry)}`);

    const updatedWalletEntry = await this.walletEntryRepostory.update(updateWalletEntryQuery, updateWalletEntry);
    logger.info(`updated wallet entry response ${JSON.stringify(updatedWalletEntry)}`);

    const updatedBalance = { balance };
    const updateBalanceQuery = { userId: wallet.userId };
    logger.info(`update wallet ${JSON.stringify(updateBalanceQuery)}`);

    const updatedWallet = await this.walletRepository.update(updateBalanceQuery, updatedBalance);

    return updatedWallet;
  }
}
