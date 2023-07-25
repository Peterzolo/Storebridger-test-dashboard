import { IContractCategory } from '../../../types/contract';
import { Schema, model } from 'mongoose';

export const DOCUMENT_NAME = 'ContractCategory';
export const COLLECTION_NAME = 'contractCategory';

const contractCategorySchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdBy: {
      type: String,
      default: 'Storebridger',
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
    lastModifiedBy: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

export const ContractCategory = model<IContractCategory>(DOCUMENT_NAME, contractCategorySchema, COLLECTION_NAME);
