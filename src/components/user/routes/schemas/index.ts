import Joi from 'joi';
import { i18n, translations } from '../../../../locales/i18n';

// TODO: trim the values to ensure empty spaces are removed before hitting the controllers
const email = Joi.string()
  .email()
  .required()
  .messages({
    'string.required': i18n.t(translations.user.validations.email.required),
    'string.empty': i18n.t(translations.user.validations.email.empty),
    'string.invalid': i18n.t(translations.user.validations.email.invalid),
  });
const firstName = Joi.string().required().min(1);
const lastName = Joi.string().required().min(1);
// TODO: add phone validation with localization options
const phone = Joi.string().required().min(1);

export default {
  createUser: Joi.object().keys({
    firstName,
    lastName,
    email,
    phoneNumber: phone,
  }),
  searchUser: Joi.object().keys({
    email,
  }),
};
