import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IDraftContract, IDraftContractRepository } from '../../../types/contract';
import { DraftContract } from '../models';

export const DRAFT_CONTRACT_REPOSITORY = Symbol('DraftContractRepository');

@injectable()
export class DraftContractRepository extends BaseRepository<IDraftContract> implements IDraftContractRepository {
  constructor() {
    super(DraftContract);
  }
}
