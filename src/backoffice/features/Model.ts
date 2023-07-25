import { Schema, model } from 'mongoose';
import { TypeFeatureFlag } from './catalog';

export const DOCUMENT_NAME = 'FeatureFlag';
export const COLLECTION_NAME = 'feature_flags';

const featureFlagSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    enabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const FeatureFlagModel = model<TypeFeatureFlag>(DOCUMENT_NAME, featureFlagSchema, COLLECTION_NAME);
