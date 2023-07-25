import { Schema, model } from 'mongoose';
import { IWalletBeneficiary } from 'wallet';

export const DOCUMENT_NAME = 'walletBeneficiary';
export const COLLECTION_NAME = 'walletBeneficiary';

const walletBeneficiarySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
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

export const WalletBeneficiary = model<IWalletBeneficiary>(DOCUMENT_NAME, walletBeneficiarySchema, COLLECTION_NAME);
