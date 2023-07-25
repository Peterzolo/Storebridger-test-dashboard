import { IContractAppeal } from 'contract';
import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Appeal';
export const COLLECTION_NAME = 'appeals';

const contractAppealSchema = new Schema<IContractAppeal>(
  {
    contractId: {
      type: String,
      required: true,
    },
    appealRaiserId: {
      type: String,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
    },
    attachment: {
      type: Array,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const ContractAppeal = model<IContractAppeal>(DOCUMENT_NAME, contractAppealSchema, COLLECTION_NAME);
