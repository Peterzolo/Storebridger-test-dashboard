import { model, Schema } from 'mongoose';
import { IUser } from '../../../types/user';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 1,
      maxlength: 60,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 1,
      maxlength: 60,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phoneNumber: { type: String, trim: true },
    localeCode: {
      type: String,
      default: 'en-NG',
      // https://saimana.com/list-of-country-locale-code/
    },
    currencyCode: {
      type: String,
      default: 'NGN',
      // https://www.iban.com/currency-codes
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const User = model<IUser>(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
