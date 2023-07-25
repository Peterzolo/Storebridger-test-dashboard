import Joi from 'joi';
import { i18n, translations } from '../../../../locales/i18n';

const amount = Joi.number()
  .required()
  .empty()
  .positive()
  .messages({
    'number.required': i18n.t(translations.wallet.validations.amount.required),
    'number.empty': i18n.t(translations.wallet.validations.amount.empty),
    'number.positive': i18n.t(translations.wallet.validations.amount.postive),
  });

const bankCode = Joi.number()
  .required()
  .empty()
  .messages({
    'number.required': i18n.t(translations.wallet.validations.bankCode.required),
    'number.empty': i18n.t(translations.wallet.validations.bankCode.empty),
    'number.invalid': i18n.t(translations.wallet.validations.bankCode.invalid),
  });

const bankName = Joi.string()
  .required()
  .empty()
  .messages({
    'string.required': i18n.t(translations.wallet.validations.bankName.required),
    'string.empty': i18n.t(translations.wallet.validations.bankName.empty),
  });

const accountNumber = Joi.string()
  .required()
  .min(10)
  .empty()
  .messages({
    'string.required': i18n.t(translations.wallet.validations.accountNumber.required),
    'string.empty': i18n.t(translations.wallet.validations.accountNumber.empty),
    'string.invalid': i18n.t(translations.wallet.validations.accountNumber.invalid),
  });

const pin = Joi.string()
  .required()
  .min(4)
  .empty()
  .messages({
    'string.required': i18n.t(translations.wallet.validations.pin.required),
    'string.empty': i18n.t(translations.wallet.validations.pin.empty),
    'string.invalid': i18n.t(translations.wallet.validations.pin.invalid),
  });

const contractId = Joi.string().required().empty().messages({
  'string.required': '',
  'string.empty': '',
});

export default {
  creditWallet: Joi.object().keys({ amount }),
  debitWallet: Joi.object().keys({ amount, bankCode, accountNumber }),
  createWallet: Joi.object().keys({ pin }),
  verifyAccountNumber: Joi.object().keys({ accountNumber, bankCode, bankName }),
  walletPayment: Joi.object().keys({ pin, amount, contractId }),
};
