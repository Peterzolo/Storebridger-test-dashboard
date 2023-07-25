import { Schema, model } from 'mongoose';
import { IPayment } from '../../../types/payment';

export const DOCUMENT_NAME = 'Payment';
export const COLLECTION_NAME = 'payment';

const paymentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    paymentProvider: {
      type: String,
    },
    amount: {
      type: String,
    },
    paymentUrl: {
      type: String,
    },
    recipientId: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ['WALLET', 'CONTRACT'],
    },
    meta: {
      type: Map,
    },
    status: {
      type: String,
      enum: ['FAILED', 'PROCESSED', 'PROCESSING', 'UNKNOWN'],
      default: 'PROCESSING',
    },
    paymentProviderStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Payment = model<IPayment>(DOCUMENT_NAME, paymentSchema, COLLECTION_NAME);
