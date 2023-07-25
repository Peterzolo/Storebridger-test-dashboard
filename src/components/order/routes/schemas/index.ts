import Joi from 'joi';
import { i18n } from '../../../../locales/i18n';

const orderItem = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .empty()
    .required()
    .messages({
      'string.required': i18n.t('order.create.validation.orderItem.name.required'),
      'string.empty': i18n.t('order.create.validation.orderItem.name.empty'),
      'string.min': i18n.t('order.create.validation.orderItem.name.invalid'),
    }),

  price: Joi.number()
    .empty()
    .required()
    .messages({
      'number.required': i18n.t('order.create.validation.orderItem.price.required'),
      'number.empty': i18n.t('order.create.validation.orderItem.price.empty'),
    }),

  quantity: Joi.number()
    .empty()
    .required()
    .messages({
      'number.required': i18n.t('order.create.validation.orderItem.quantity.required'),
      'number.empty': i18n.t('order.create.validation.orderItem.quantity.empty'),
    }),

  description: Joi.string()
    .required()
    .empty()
    .messages({
      'string.required': i18n.t('order.create.validation.orderItem.description.required'),
      'string.empty': i18n.t('order.create.validation.orderItem.description.empty'),
    }),

  condition: Joi.string()
    .valid('NEW', 'FOREIGN_USED', 'NIGERIAN_USED')
    .required()
    .empty()
    .messages({
      'string.required': i18n.t('order.create.validation.orderItem.condition.required'),
      'string.empty': i18n.t('order.create.validation.orderItem.condition.empty'),
      'string.invalid': i18n.t('order.create.validation.orderItem.condition.invalid'),
    }),

  images: Joi.array()
    .items(
      Joi.string()
        .required()
        .empty()
        .messages({
          'string.required': i18n.t('order.create.validation.orderItem.images.required'),
          'string.empty': i18n.t('order.create.validation.orderItem.images.empty'),
        }),
    )
    .required()
    .empty()
    .messages({
      'array.required': i18n.t('order.create.validation.orderItem.images.required'),
      'array.empty': i18n.t('order.create.validation.orderItem.images.empty'),
    }),
});

const contractId = Joi.string()
  .min(12)
  .required()
  .empty()
  .messages({
    'string.required': i18n.t('order.create.validation.contractId.required'),
    'string.empty': i18n.t('order.create.validation.contractId.empty'),
    'string.min': i18n.t('order.create.validation.contractId.invalid'),
  });

const authorRole = Joi.string()
  .valid('BUYER', 'SELLER')
  .required()
  .empty()
  .messages({
    'string.required': i18n.t('order.create.validation.authorRole.required'),
    'string.empty': i18n.t('order.create.validation.authorRole.empty'),
    'string.invalid': i18n.t('order.create.validation.authorRole.invalid'),
  });

const orderItems = Joi.array()
  .items(orderItem)
  .required()
  .empty()
  .messages({
    'array.required': i18n.t('order.create.validation.orderItems.required'),
    'array.empty': i18n.t('order.create.validation.orderItems.empty'),
  });

const orderId = Joi.string()
  .required()
  .empty()
  .messages({
    'string.required': i18n.t('order.createDeliveryDetails.validation.orderId.required'),
    'string.empty': i18n.t(`order.createDeliveryDetails.validation.orderId.empty`),
  });

const deliveryChargeToBuyer = Joi.boolean()
  .required()
  .empty()
  .messages({
    'boolean.required': i18n.t('order.createDeliveryDetails.validation.deliveryChargeToBuyer.required'),
    'boolean.empty': i18n.t(`order.createDeliveryDetails.validation.deliveryChargeToBuyer.empty`),
    'string.invalid': i18n.t(`order.createDeliveryDetails.validation.deliveryChargeToBuyer.invalid`),
  });

const hasFlexibleDeliveryDate = Joi.boolean()
  .required()
  .empty()
  .messages({
    'boolean.required': i18n.t('order.createDeliveryDetails.validation.hasFlexibleDeliveryDate.required'),
    'boolean.empty': i18n.t(`order.createDeliveryDetails.validation.hasFlexibleDeliveryDate.empty`),
    'string.invalid': i18n.t(`order.createDeliveryDetails.validation.hasFlexibleDeliveryDate.invalid`),
  });

const deliveryAddress = Joi.string()
  .required()
  .empty()
  .messages({
    'string.required': i18n.t('order.createDeliveryDetails.validation.deliveryAddress.required'),
    'string.empty': i18n.t(`order.createDeliveryDetails.validation.deliveryAddress.empty`),
  });

const deliveryDate = Joi.date()
  .raw()
  .required()
  .empty()
  .messages({
    'date.required': i18n.t('order.createDeliveryDetails.validation.deliveryDate.required'),
    'date.empty': i18n.t(`order.createDeliveryDetails.validation.deliveryDate.empty`),
    'date.raw': i18n.t(`order.createDeliveryDetails.validation.deliveryDate.invalid`),
  });

const deliveryFee = Joi.number()
  .required()
  .empty()
  .messages({
    'number.required': i18n.t('order.createDeliveryDetails.validation.deliveryFee.required'),
    'number.empty': i18n.t(`order.createDeliveryDetails.validation.deliveryFee.empty`),
  });

const recipientPhoneNumber = Joi.number()
  .required()
  .empty()
  .messages({
    'number.required': i18n.t('order.createDeliveryDetails.validation.recipientPhoneNumber.required'),
    'number.empty': i18n.t(`order.createDeliveryDetails.validation.recipientPhoneNumber.empty`),
  });

export default {
  createOrder: Joi.object().keys({ orderItems, contractId, authorRole }),
  createDeliveryDetails: Joi.object().keys({
    orderId,
    deliveryAddress,
    hasFlexibleDeliveryDate,
    deliveryChargeToBuyer,
    deliveryFee,
    deliveryDate,
    recipientPhoneNumber,
  }),
};
