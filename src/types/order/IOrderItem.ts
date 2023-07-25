import { Read, Write } from '../../databases/mongodb';

export interface IOrderItem {
  id: string;
  orderId: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  images: Array<string>;
  condition: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IUpdateOrderItem {
  name?: string;
  price?: number;
  quantity?: number;
  description?: string;
  images?: Array<string>;
  condition?: string;
  status?: string;
  contractId: string;
  keepClauses?: boolean;
}

export interface IReadOrderItem {
  id?: string;
  orderId?: string;
}

export interface IDeleteOrderItem {
  [key: string]: any;
}

export interface ICreateOrderItems {
  orderId: string;
  orderItems: Array<IOrderItem>;
}

export interface ICreateOrderItem {
  [key: string]: any;
}

export interface IOrderItemDTO {
  createMany(payload: ICreateOrderItems): Array<Partial<IOrderItem>>;

  create(payload: ICreateOrderItem): Partial<IOrderItem>;

  update(payload: IUpdateOrderItem): Partial<IOrderItem>;
}

export interface IOrderItemPresenter {
  serialize(orderDocument: IOrderItem, selectors: Array<keyof IOrderItem>): Partial<IOrderItem>;
}

export interface IOrderItemRepository extends Read<IOrderItem>, Write<IOrderItem> {}

export interface IOrderItemService {
  createMany(payload: ICreateOrderItems): Promise<IOrderItem[]>;

  create(payload: ICreateOrderItem): Promise<IOrderItem>;

  read(query: IReadOrderItem): Promise<Partial<IOrderItem> | null>;

  readMany(query: IReadOrderItem): Promise<Partial<IOrderItem>[]>;

  update(query: IReadOrderItem, payload: IUpdateOrderItem): Promise<Partial<IOrderItem>>;

  delete(query: IReadOrderItem): Promise<Partial<IOrderItem>>;
}
