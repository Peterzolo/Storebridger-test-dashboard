import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { ContractAppeal } from '../models/ContractAppeal';
import { IContractAppeal, IContractAppealRepository } from 'contract';

export const CONTRACT_APPEAL_REPOSITORY = Symbol('ContractAppealRepository');

@injectable()
export class ContractAppealRepository extends BaseRepository<IContractAppeal> implements IContractAppealRepository {
  constructor() {
    super(ContractAppeal);
  }
}
