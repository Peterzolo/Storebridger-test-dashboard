import Joi from 'joi';
import { i18n, translations } from '../../../../locales/i18n';

const title = Joi.string()
  .min(5)
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.contract.validations.title.required),
    'string.empty': i18n.t(translations.contract.validations.title.empty),
    'string.min': i18n.t(translations.contract.validations.title.invalid),
  });

const contractCategoryId = Joi.string().messages({});

const contractId = Joi.string()
  .min(12)
  .empty()
  .required()
  .messages({
    'string.required': i18n.t(translations.contract.validations.contractId.required),
    'string.empty': i18n.t(translations.contract.validations.contractId.empty),
    'string.min': i18n.t(translations.contract.validations.contractId.invalid),
  });

const inviteeEmail = Joi.string()
  .email()
  .required()
  .empty()
  .messages({
    'string.invalid': i18n.t(translations.contract.validations.inviteeEmail.invalid),
    'string.required': i18n.t(translations.contract.validations.inviteeEmail.required),
    'string.empty': i18n.t(translations.contract.validations.inviteeEmail.empty),
  });

const contract = Joi.string()
  .required()
  .messages({
    'string.required': i18n.t(translations.contract.validations.contract.required),
  });

export default {
  createContractCategory: Joi.object().keys({
    title,
  }),
  createContract: Joi.object().keys({
    contractCategoryId,
  }),
  signContract: Joi.object().keys({
    contractId,
  }),
  updateRecipientId: Joi.object().keys({
    contractId,
  }),
  inviteRecipient: Joi.object().keys({
    contractId,
    inviteeEmail,
  }),
  createDraftContract: Joi.object().keys({ contract }),

  acceptContractInvitation: Joi.object().keys({ contractId }),
};
