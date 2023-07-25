import bcrypt from 'bcryptjs';
import { Schema, model, CallbackError } from 'mongoose';
import { IAuth } from '../../../types/auth/IAuth';

export const DOCUMENT_NAME = 'Auth';
export const COLLECTION_NAME = 'auths';

const authSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    oauthId: {
      type: String,
      trim: true,
      default: '',
    },
    oauthTokenId: {
      type: String,
      trim: true,
      default: '',
    },
    primaryKey: {
      type: Schema.Types.String,
    },
    secondaryKey: {
      type: Schema.Types.String,
    },
    status: {
      type: Schema.Types.Boolean,
      default: false,
    },
    password: { type: String, trim: true },
    oauthType: {
      type: String,
      trim: true,
      default: 'LOCAL',
      enum: ['LOCAL', 'FACEBOOK', 'GOOGLE'],
    },
    phoneNumber: { type: String, trim: true },
    phoneToken: { type: String, trim: true },
    phoneTokenExpires: Date,
    hasVerifiedEmail: { type: Boolean, default: false },
    hasVerifiedPhone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

authSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hash = bcrypt.hashSync(this.password || '');
    this.password = hash;

    return next();
  } catch (error) {
    return next(error as CallbackError);
  }
});

authSchema.pre<IAuth>('updateOne', async function (next) {
  try {
    const hash = bcrypt.hashSync(this.password || '');
    this.password = hash;

    return next();
  } catch (error) {
    return next(error as CallbackError);
  }
});

export const Auth = model<IAuth>(DOCUMENT_NAME, authSchema, COLLECTION_NAME);
