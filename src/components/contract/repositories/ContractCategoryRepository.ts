import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IContractCategory, IContractCategoryRepository } from '../../../types/contract';
import { ContractCategory } from '../models';

export const CONTRACT_CATEGORY_REPOSITORY = Symbol('ContractCategoryRepository');

@injectable()
export class ContractCategoryRepository
  extends BaseRepository<IContractCategory>
  implements IContractCategoryRepository
{
  constructor() {
    super(ContractCategory);
  }
}
