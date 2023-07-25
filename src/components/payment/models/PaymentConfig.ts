import { Schema, model } from 'mongoose';
import { IPaymentConfig } from '../../../types/payment';

export const DOCUMENT_NAME = 'PaymentConfig';
export const COLLECTION_NAME = 'paymentconfig';

const paymentConfigSchema = new Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    providerCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const PaymentConfig = model<IPaymentConfig>(DOCUMENT_NAME, paymentConfigSchema, COLLECTION_NAME);
