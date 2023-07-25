import { Schema, model } from 'mongoose';
import { IOrder } from '../../../types/order';

export const DOCUMENT_NAME = 'Order';
export const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
  {
    contractId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      trim: true,
      required: true,
    },
    sellerId: {
      type: String,
    },
    buyerId: {
      type: String,
    },
    deliveryDetailsId: {
      type: String,
    },
    totalQuantity: {
      type: Number,
    },
    lastModifiedBy: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    status: {
      type: String,
      default: 'PROCESSING',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Order = model<IOrder>(DOCUMENT_NAME, orderSchema, COLLECTION_NAME);
