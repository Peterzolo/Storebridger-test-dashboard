import Joi from 'joi';
import { i18n, translations } from '../../../../locales/i18n';

const name = Joi.string()
  .min(5)
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.paymentConfig.validations.name.required),
    'string.empty': i18n.t(translations.paymentConfig.validations.name.empty),
    'string.min': i18n.t(translations.paymentConfig.validations.name.invalid),
  });

const providerCode = Joi.string()
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.paymentConfig.validations.providerCode.required),
    'string.empty': i18n.t(translations.paymentConfig.validations.providerCode.empty),
  });

const paymentConfigId = Joi.string()
  .empty()
  .required()
  .min(12)
  .messages({
    'string.required': i18n.t(translations.paymentConfig.validations.paymentConfigId.required),
    'string.empty': i18n.t(translations.paymentConfig.validations.paymentConfigId.empty),
    'string.min': i18n.t(translations.paymentConfig.validations.paymentConfigId.invalid),
  });

const amount = Joi.number()
  .empty()
  .required()
  .messages({
    'number.required': i18n.t(translations.payment.validations.amount.required),
    'number.empty': i18n.t(translations.payment.validations.amount.empty),
  });

const reference = Joi.string()
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.payment.validations.reference.required),
    'string.empty': i18n.t(translations.payment.validations.reference.empty),
  });

const accountNumber = Joi.string()
  .empty()
  .required()
  .min(10)
  .messages({
    'string.empty': i18n.t(translations.payment.validations.accountNumber.empty),
    'string.invalid': i18n.t(translations.payment.validations.accountNumber.invalid),
    'string.required': i18n.t(translations.payment.validations.accountNumber.required),
  });

const bankCode = Joi.string()
  .empty()
  .required()
  .messages({
    'string.empty': i18n.t(translations.payment.validations.bankCode.empty),
    'string.required': i18n.t(translations.payment.validations.bankCode.required),
  });

const meta = Joi.object()
  .required()
  .messages({
    'object.required': i18n.t(translations.payment.validations.meta.required),
  });

const recipientId = Joi.string()
  .empty()
  .required()
  .messages({
    'string.empty': i18n.t(translations.contract.validations.recipientId.empty),
    'string.required': i18n.t(translations.contract.validations.recipientId.required),
  });

const paymentType = Joi.string()
  .empty()
  .required()
  .messages({
    'string.empty': i18n.t(translations.payment.validations.paymentType.empty),
    'string.required': i18n.t(translations.payment.validations.paymentType.required),
  });

export default {
  createPaymentConfig: Joi.object().keys({
    name,
    providerCode,
  }),
  setDefaultPaymentConfig: Joi.object().keys({
    paymentConfigId,
  }),
  initiatePayment: Joi.object().keys({
    amount,
    meta,
    paymentType,
    recipientId,
  }),
  verifyPayment: Joi.object().keys({
    reference,
  }),
  verifyAccountNumber: Joi.object().keys({
    accountNumber,
    bankCode,
  }),
};
