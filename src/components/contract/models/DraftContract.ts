import { IDraftContract } from 'contract';
import { Schema, model } from 'mongoose';

export const DOCUMENT_NAME = 'DraftContract';
export const COLLECTION_NAME = 'draftContracts';

const draftContract = new Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    contract: {
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

export const DraftContract = model<IDraftContract>(DOCUMENT_NAME, draftContract, COLLECTION_NAME);
