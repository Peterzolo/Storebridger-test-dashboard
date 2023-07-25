import Joi from 'joi';
import { i18n } from '../../../../locales/i18n';

const imageUrl = Joi.string()
  .empty()
  .required()
  .messages({
    'string.required': i18n.t('images.destroy.validation.image.required'),
    'string.empty': i18n.t('images.destroy.validation.image.empty'),
  });

export default {
  destroyImage: Joi.object().keys({ imageUrl }),
};
