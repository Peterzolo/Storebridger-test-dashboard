export interface IAuth {
  id: string;
  _id: string;
  email: string;
  userId?: string;
  oauthId?: string;
  status?: boolean;
  password?: string;
  oauthType?: string;
  oauthTokenId?: string;
  primaryKey?: string;
  phoneNumber?: string;
  phoneToken?: string;
  phoneTokenExpires?: Date;
  secondaryKey?: string;
  resetPassword?: string;
  hasVerifiedEmail?: boolean;
  hasVerifiedPhone?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
