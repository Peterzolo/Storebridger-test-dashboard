import { Schema, model } from 'mongoose';
import { IDeliveryDetails } from '../../../types/order';

export const DOCUMENT_NAME = 'DeliveryDetails';
export const COLLECTION_NAME = 'deliveryDetails';

const deliverySchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    deliveryChargeToBuyer: {
      type: Boolean,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    recipientPhoneNumber: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    hasFlexibleDeliveryDate: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const DeliveryDetails = model<IDeliveryDetails>(DOCUMENT_NAME, deliverySchema, COLLECTION_NAME);
