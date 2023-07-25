import { Read, Write } from '../../databases/mongodb';
import { IOrderItem } from 'order/IOrderItem';
import { IContractContentTemplate } from 'contract';

export interface IOrder {
  id: string;
  title: string;
  avatar: string;
  totalAmount: number;
  contractId: string;
  sellerId: string;
  buyerId: string;
  deliveryDetailsId: string;
  totalQuantity: number;
  orderItems: Array<IOrderItem>;
  lastModifiedBy: string;
  createdBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDeliveryDetail {
  deliveryChargeToBuyer: boolean;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryDate: Date;
  hasFlexibleDeliveryDate: boolean;
}

export enum Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ConditionEnum {
  NEW = 'NEW',
  NGN_USED = 'NGN_USED',
  FOGN_USED = 'FRGN_USED',
}

export interface IDeliveryDetails {
  id: string;
  orderId: string;
  deliveryChargeToBuyer: boolean;
  deliveryFee: number;
  deliveryAddress: string;
  recipientPhoneNumber: string;
  deliveryDate: Date;
  hasFlexibleDeliveryDate: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

export interface IOrderContractContentTemplate {
  contractId: string;
  placeholders: {
    orderItems: Array<IOrderItem>;
    orderId: string;
    buyerId?: string;
    sellerId?: string;
    orderTotalAmount: number;
    contractType: string;
    authorCountryOfRecidence: string;
  };
}

export interface ICreateOrderItems {
  orderId: string;
  orderItems: Array<IOrderItem>;
}

export interface ICreateOrder {
  contractId: string;
  orderItems: Array<IOrderItem>;
  authorRole: 'SELLER | BUYER';
  createdBy: string;
  sellerId?: string;
  buyerId?: string;
  createdByEmail: string;
}

export interface IReadOrder {
  id?: string;
  userEmail?: string;
  contractId?: string;
  authorRole?: string;
  ids?: string;
  contractIds?: string;
}

export interface IUpdateOrder {
  contractId?: string;
  authorRole?: string;
  createdBy?: string;
  sellerId?: string;
  buyerId?: string;
  createdByEmail?: string;
}

export interface ICreateRecipient {
  order?: Partial<IOrder>;
  recipientId: string;
  contractId: string;
}

export interface ICreateDeliveryDetails {
  deliveryChargeToBuyer: boolean;
  deliveryFee: number;
  deliveryAddress: string;
  recipientPhoneNumber: string;
  deliveryDate: Date;
  createdByEmail: string;
  hasFlexibleDeliveryDate: boolean;
  createdBy: string;
  orderId: string;
}

export interface IUpdateDeliveryDetails {
  deliveryChargeToBuyer?: boolean;
  deliveryFee?: number;
  deliveryAddress?: string;
  recipientPhoneNumber?: string;
  deliveryDate: Date;
  createdByEmail?: string;
  hasFlexibleDeliveryDate?: boolean;
}

export interface IReadDeliveryDetails {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface IReadDeliverQuery {
  id?: string;
  orderId?: string;
}

export interface IOrderDTO {
  create(payload: ICreateOrder): Partial<ICreateOrder>;

  createRecipient(payload: ICreateRecipient): Partial<ICreateRecipient>;
}

export interface IDeliveryDetailsDTO {
  create(payload: ICreateDeliveryDetails): Partial<IDeliveryDetails>;

  update(payload: IUpdateDeliveryDetails): Partial<IDeliveryDetails>;
}

export interface IOrderContractContentTemplateDTO {
  create(payload: IOrderContractContentTemplate): Partial<IContractContentTemplate>;
}

export interface IOrderPresenter {
  serialize(orderDocument: IOrder, selectors: Array<keyof IOrder>): Partial<IOrder>;
}

export interface IDeliveryDetailsPresenter {
  serialize(deliveryDocument: IDeliveryDetails, selectors: Array<keyof IDeliveryDetails>): Partial<IDeliveryDetails>;
}

export interface IOrderRepository extends Read<IOrder>, Write<IOrder> {}

export interface IDeliveryDetailsRepository extends Read<IDeliveryDetails>, Write<IDeliveryDetails> {}

export interface IOrderPresenter {
  serialize(orderDocument: IOrder, selectors: Array<keyof IOrder>): Partial<IOrder>;
}

export interface IDeliveryDetailsPresenter {
  serialize(deliveryDocument: IDeliveryDetails, selectors: Array<keyof IDeliveryDetails>): Partial<IDeliveryDetails>;
}

export interface IOrderService {
  create(payload: ICreateOrder): Promise<Partial<IOrder>>;

  read(query: Record<string, unknown>): Promise<Partial<IOrder> | null>;

  readMany(payload: { query: IReadOrder; userEmail: string }): Promise<Partial<IOrder>[]>;

  update(query: IReadOrder, payload: IUpdateOrder): Promise<Partial<IOrder> | null>;

  delete(id: string): Promise<Partial<IOrder> | null>;

  addDeliveryDetails(payload: { orderId: string; deliveryDetailsId: string }): Promise<Partial<IOrder>>;

  createRecipient(payload: ICreateRecipient): Promise<Partial<IOrder>>;

  editRole(payload: { contractId: string; userEmail: string }): Promise<Partial<IOrder> | null>;
}

export interface IDeliveryDetailsService {
  create(payload: ICreateDeliveryDetails): Promise<Partial<IDeliveryDetails>>;

  read(query: IReadDeliveryDetails): Promise<Partial<IDeliveryDetails>>;

  readMany(query: IReadDeliveryDetails): Promise<Partial<IDeliveryDetails>[]>;

  update(query: IReadDeliverQuery, payload: IUpdateDeliveryDetails): Promise<Partial<IDeliveryDetails>>;
}
