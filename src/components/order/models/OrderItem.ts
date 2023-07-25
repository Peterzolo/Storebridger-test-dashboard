import { model, Schema } from 'mongoose';
import { IOrderItem } from '../../../types/order';

export const DOCUMENT_NAME = 'OrderItem';
export const COLLECTION_NAME = 'orderItems';

const orderItemSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['NEW', 'NIGERIAN_USED', 'FOREIGN_USED'],
    },
    status: {
      types: String,
      enum: ['APPROVED', 'REPLACEMENT', 'REFUND'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const OrderItem = model<IOrderItem>(DOCUMENT_NAME, orderItemSchema, COLLECTION_NAME);
