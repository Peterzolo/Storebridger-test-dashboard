import _ from 'lodash';
import { injectable } from 'inversify';
import { IContractAppeal, IContractAppealPresenter } from 'contract';

export const CONTRACT_APPEAL_PRESENTER = Symbol('ContractAppealPresenter');

@injectable()
export class ContractAppealPresenter implements IContractAppealPresenter {
  public serialize(document: IContractAppeal, selectors: string[] = []): Partial<IContractAppeal> {
    const contractAppealEntity = {
      id: document.id,
      contractId: document.contractId,
      appealRaiserId: document.appealRaiserId,
      complaint: document.complaint,
    };

    return selectors.length > 0 ? _.pick(contractAppealEntity, selectors) : contractAppealEntity;
  }
}
