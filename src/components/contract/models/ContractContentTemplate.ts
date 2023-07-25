import { IContractContentTemplate } from '../../../types/contract';
import { Schema, model } from 'mongoose';

export const DOCUMENT_NAME = 'ContractContentTemplate';
export const COLLECTION_NAME = 'contractContentTemplates';

const contractContentTemplateSchema = new Schema(
  {
    contractId: {
      type: String,
      required: true,
    },
    placeholders: {
      type: Map,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const ContractContentTemplate = model<IContractContentTemplate>(
  DOCUMENT_NAME,
  contractContentTemplateSchema,
  COLLECTION_NAME,
);
