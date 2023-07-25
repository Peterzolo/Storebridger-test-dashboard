import _ from 'lodash';
import { injectable } from 'inversify';
import { IDraftContract, IDraftContractPresenter } from 'contract';

export const DRAFT_CONTRACT_PRESENTER = Symbol('DraftContractPresenter');

@injectable()
export class DraftContractPresenter implements IDraftContractPresenter {
  public serialize(draftContractDocument: IDraftContract, selectors: string[]): Partial<IDraftContract> {
    const draftContractEntity = {
      id: draftContractDocument.id,
      authorId: draftContractDocument.authorId,
      contract: draftContractDocument.contract,
    };

    return selectors.length > 0 ? _.pick(draftContractEntity, selectors) : draftContractEntity;
  }
}
