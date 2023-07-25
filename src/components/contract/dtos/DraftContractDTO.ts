import { ICreateDraftContract, IDraftContract } from 'contract';
import { injectable } from 'inversify';

export const DRAFT_CONTRACT_DTO = Symbol('DraftContractDTO');

@injectable()
export class DraftContractDTO {
  public create(payload: ICreateDraftContract): Partial<IDraftContract> {
    const { authorId, contract } = payload;

    return {
      authorId,
      contract,
    };
  }
}
