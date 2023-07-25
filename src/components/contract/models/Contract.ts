import { IContract } from 'contract';
import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'Contract';
export const COLLECTION_NAME = 'contracts';

const contractSchema = new Schema<IContract>(
  {
    authorId: {
      type: String,
      required: true,
    },

    contractCategoryId: {
      type: String,
      required: true,
    },

    recipientId: {
      type: String,
    },

    recipientEmail: {
      type: String,
    },

    authorSignature: {
      type: String,
      trim: true,
    },

    recipientSignature: {
      type: String,
      trim: true,
    },

    contentTemplateId: {
      type: String,
    },

    inviteeEmail: {
      type: String,
    },
    inviteAcceptanceDate: {
      type: Date,
    },

    invitationDate: {
      type: Date,
    },

    status: {
      type: String,
      trim: true,
      enum: ['PENDING', 'COMPLETED', 'ARCHIVED'],
      default: 'PENDING',
    },
    effectiveOn: {
      type: Date,
    },
    authorSignatureDate: {
      type: Date,
    },
    recipientSignatureDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Contract = model<IContract>(DOCUMENT_NAME, contractSchema, COLLECTION_NAME);
