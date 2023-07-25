import { injectable } from 'inversify';
import {
  ICreateContractContentTemplate,
  IContractContentTemplateDTO,
  IContractContentTemplate,
} from '../../../types/contract';

export const CONTRACT_CONTENT_TEMPLATE_DTO = Symbol('ContractContentTemplateDTO');

@injectable()
export class ContractContentTemplateDTO implements IContractContentTemplateDTO {
  public create(payload: ICreateContractContentTemplate): Partial<IContractContentTemplate> {
    const { contractId, placeholders } = payload;

    return {
      contractId,
      placeholders,
    };
  }
}
