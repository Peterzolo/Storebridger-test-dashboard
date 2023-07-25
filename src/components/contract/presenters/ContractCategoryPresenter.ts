import _ from 'lodash';
import { injectable } from 'inversify';
import { IContractCategory, IContractCategoryPresenter } from '../../../types/contract';

export const CONTRACT_CATEGORY_PRESENTER = Symbol('ContractCategoryRepository');

@injectable()
export class ContractCategoryPresenter implements IContractCategoryPresenter {
  public serialize(
    contractCategoryDocument: IContractCategory,
    selectors: string[] = ['id'],
  ): Partial<IContractCategory> {
    const contractCategoryEntity = {
      id: contractCategoryDocument.id,
      title: contractCategoryDocument.title,
      createdBy: contractCategoryDocument.createdBy,
      lastModifiedBy: contractCategoryDocument.lastModifiedBy,
      isArchived: contractCategoryDocument.isArchived,
      createdAt: contractCategoryDocument.createdAt,
    };

    return _.pick(contractCategoryEntity, selectors);
  }
}
