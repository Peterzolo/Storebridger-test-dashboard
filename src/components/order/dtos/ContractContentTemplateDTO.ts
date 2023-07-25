import { injectable } from 'inversify';
import { IOrderContractContentTemplate, IOrderContractContentTemplateDTO, IOrderItem } from '../../../types/order';
import { IContractContentTemplate } from '../../../types/contract';
import { capitalizeString } from '../../../library/helpers';
import { generateDefaultItemClauses } from '../utils/DefaultItemClauses';

export const CONTRACT_CONTENT_TEMPLATE_DTO = Symbol('ContractContentTemplateDTO');

@injectable()
export class ContractContentTemplateDTO implements IOrderContractContentTemplateDTO {
  public create(payload: IOrderContractContentTemplate): Partial<IContractContentTemplate> {
    const { orderId, orderItems, orderTotalAmount, contractType, authorCountryOfRecidence, sellerId, buyerId } =
      payload.placeholders;

    return {
      contractId: payload.contractId,
      placeholders: {
        orderItemsClauses: this._generateOrderItemClauses(orderItems),
        orderId,
        orderTotalAmount,
        sellerId,
        buyerId,
        authorCountryOfRecidence,
        contractType,
      },
    };
  }

  private _generateOrderItemClauses(orderItems: IOrderItem[]): Record<string, unknown> {
    const orderItemClauses: Record<string, unknown> = {};

    for (const orderItem of orderItems) {
      const systemDefinedClauses = generateDefaultItemClauses({
        quantity: orderItem.quantity,
        condition: orderItem.condition,
      });

      const userDefinedClauses = orderItem.description.split(',').map((item) => {
        return {
          name: capitalizeString(item),
          score: 0,
          isSystemDefined: false,
        };
      });

      orderItemClauses[orderItem.id] = {
        qty: orderItem.quantity,
        clauses: [...userDefinedClauses, ...systemDefinedClauses],
      };
    }

    return orderItemClauses;
  }
}
