import { Schema, model } from 'mongoose';
import { IWalletEntry } from '../../../types/wallet';

export const DOCUMENT_NAME = 'WalletEntry';
export const COLLECTION_NAME = 'walletentry';

const walletEntrySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    walletId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    contractId: {
      type: String,
    },
    type: {
      type: String,
      enum: ['WITHDRAWAL', 'DEPOSIT', 'RECEIVE', 'SENT'],
    },
    recipientId: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      default: 0,
    },
    debit: {
      type: Number,
      default: 0,
    },
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: ['FAILED', 'PROCESSED', 'PROCESSING', 'UNKNOWN', 'UPCOMING'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const WalletEntry = model<IWalletEntry>(DOCUMENT_NAME, walletEntrySchema, COLLECTION_NAME);
