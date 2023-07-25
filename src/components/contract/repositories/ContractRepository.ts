import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IContract, IContractRepository } from '../../../types/contract';
import { Contract } from '../models';

export const CONTRACT_REPOSITORY = Symbol('ContractRepository');

@injectable()
export class ContractRepository extends BaseRepository<IContract> implements IContractRepository {
  constructor() {
    super(Contract);
  }
}
