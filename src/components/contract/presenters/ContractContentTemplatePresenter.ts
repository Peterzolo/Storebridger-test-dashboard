import _ from 'lodash';
import { injectable } from 'inversify';
import { IContractContentTemplate, IContractContentTemplatePresenter } from '../../../types/contract';

export const CONTRACT_CONTENT_TEMPLATE_PRESENTER = Symbol('ContractContentTemplatePresenter');

@injectable()
export class ContractContentTemplatePresenter implements IContractContentTemplatePresenter {
  public serialize(
    contractContentTemplateDocument: IContractContentTemplate,
    selectors: string[],
  ): Partial<IContractContentTemplate> {
    const contractContentTemplateEntity = {
      id: contractContentTemplateDocument.id,
      contractId: contractContentTemplateDocument.contractId,
      placeholders: contractContentTemplateDocument.placeholders,
    };

    return selectors.length > 0 ? _.pick(contractContentTemplateEntity, selectors) : contractContentTemplateEntity;
  }
}
