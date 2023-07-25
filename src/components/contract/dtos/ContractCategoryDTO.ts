import { injectable } from 'inversify';
import { ICreateContractCategory, IContractCategoryDTO, IContractCategory } from '../../../types/contract';
import { capitalizeString } from '../../../library/helpers';

export const CONTRACT_CATEGORY_DTO = Symbol('ContractCategoryDTO');

@injectable()
export class ContractCategoryDTO implements IContractCategoryDTO {
  public create(payload: ICreateContractCategory): Partial<IContractCategory> {
    const { title, createdBy } = payload;

    return {
      title: capitalizeString(title),
      createdBy,
    };
  }
}
