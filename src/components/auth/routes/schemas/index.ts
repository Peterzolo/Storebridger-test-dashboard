import Joi from 'joi';
import { JoiAuthBearer } from '../../../../library/helpers';
import { i18n, translations } from '../../../../locales/i18n';

const email = Joi.string()
  .label('email')
  .trim()
  .empty()
  .lowercase()
  .email({ minDomainSegments: 2 })
  .required()
  .messages({
    'string.required': i18n.t(translations.auth.validations.email.required),
    'string.email': i18n.t(translations.auth.validations.email.invalid),
    'string.empty': i18n.t(translations.auth.validations.email.empty),
  });

const token = Joi.string()
  .label('token')
  .trim()
  .empty()
  .required()
  .messages({
    'string.empty': i18n.t(translations.auth.validations.token.required),
  });
const idToken = Joi.string()
  .label('oauthId')
  .trim()
  .empty()
  .required()
  .messages({
    'string.empty': i18n.t(translations.auth.validations.oAuthId.google.required),
    'string.required': i18n.t(translations.auth.validations.oAuthId.google.required),
  });

const confirmPassword = Joi.string()
  .label('confirmPassword')
  .trim()
  .valid(Joi.ref('password'))
  .required()
  .messages({
    'string.only': i18n.t(translations.auth.validations.confirmPassword.misMatch),
    'string.required': i18n.t(translations.auth.validations.confirmPassword.required),
    'string.valid': i18n.t(translations.auth.validations.confirmPassword.misMatch),
  });
// TODO: add password validation
const password = Joi.string()
  .min(8)
  .max(70)
  .empty()
  .label('password')
  .trim()
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
  .required()
  .messages({
    'string.required': i18n.t(translations.auth.validations.password.required),
    'string.empty': i18n.t(translations.auth.validations.password.required),
    'string.min': i18n.t(translations.auth.validations.password.min, { charCount: 8 }),
    'string.max': i18n.t(translations.auth.validations.password.max, { charCount: 70 }),
    'string.regex': i18n.t(translations.auth.validations.password.pattern),
    'string.pattern.base': i18n.t(translations.auth.validations.password.pattern),
  });
const loginPassword = Joi.string()
  .label('confirmPassword')
  .trim()
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.auth.validations.password.required),
    'string.empty': i18n.t(translations.auth.validations.password.required),
  });
const firstName = Joi.string()
  .label('firstName')
  .trim()
  .empty()
  .min(3)
  .max(50)
  .required()
  .messages({
    'string.required': i18n.t(translations.auth.validations.firstName.required),
    'string.empty': i18n.t(translations.auth.validations.firstName.required),
    'string.min': i18n.t(translations.auth.validations.firstName.min, { charCount: 3 }),
    'string.max': i18n.t(translations.auth.validations.firstName.max, { charCount: 50 }),
  });
const lastName = Joi.string()
  .label('lastName')
  .trim()
  .empty()
  .min(3)
  .max(50)
  .required()
  .messages({
    'string.required': i18n.t(translations.auth.validations.lastName.required),
    'string.empty': i18n.t(translations.auth.validations.lastName.required),
    'string.min': i18n.t(translations.auth.validations.firstName.min, { charCount: 3 }),
    'string.max': i18n.t(translations.auth.validations.firstName.max, { charCount: 50 }),
  });

const phoneNumber = Joi.string()
  .label('phoneNumber')
  .min(10)
  .max(11)
  .messages({
    'string.empty': i18n.t('auth.signup.validation.phoneNumber.phoneNumberEmpty'),
    'string.min': i18n.t('auth.signup.validation.phoneNumber.phoneNumberInvalid'),
  });

const contractId = Joi.string().optional();

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object().keys({ authorization: JoiAuthBearer().required() }).unknown(true),
  signup: Joi.object().keys({ email }),
  verifyPhone: Joi.object().keys({ email, phoneNumber }),
  googleLogin: Joi.object().keys({ idToken }),
  token: Joi.object().keys({ token }),
  completeSignup: Joi.object().keys({
    firstName,
    lastName,
    password,
    confirmPassword,
    phoneNumber: phoneNumber.allow(null, ''),
  }),
  login: Joi.object().keys({
    email,
    password: loginPassword,
    contractId,
  }),
  forgotPassword: Joi.object().keys({
    email,
  }),
  confirmPasswordReset: Joi.object().keys({
    password,
  }),
};
