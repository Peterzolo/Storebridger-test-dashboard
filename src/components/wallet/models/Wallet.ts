import { Schema, model } from 'mongoose';
import { IWallet } from '../../../types/wallet';

export const DOCUMENT_NAME = 'Wallet';
export const COLLECTION_NAME = 'wallet';

const walletSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    pin: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Wallet = model<IWallet>(DOCUMENT_NAME, walletSchema, COLLECTION_NAME);
