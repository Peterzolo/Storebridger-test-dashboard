import { injectable } from 'inversify';
import { IContractAppeal, IContractAppealDTO, ICreateContractAppeal } from 'contract';

export const CONTRACT_APPEAL_DTO = Symbol('ContractAppealDTO');

@injectable()
export class ContractAppealDTO implements IContractAppealDTO {
  public create(payload: ICreateContractAppeal): Partial<IContractAppeal> {
    const { contractId, appealRaiserId, complaint } = payload;

    return {
      contractId,
      appealRaiserId,
      complaint,
    };
  }
}
