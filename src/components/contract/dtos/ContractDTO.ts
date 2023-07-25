import { IAcceptContractInvitation, IUpdateRecipientId } from 'contract/IContractDTO';
import { injectable } from 'inversify';
import {
  IContract,
  IContractDTO,
  IContractSignature,
  ICreateContract,
  IInviteRecipient,
  IUpdateContract,
} from '../../../types/contract';

export const CONTRACT_DTO = Symbol('ContractDTO');

@injectable()
export class ContractDTO implements IContractDTO {
  acceptContractInvitation(payload: IAcceptContractInvitation): IAcceptContractInvitation {
    const { userId, contractId } = payload;

    return {
      userId,
      contractId,
      inviteAcceptanceDate: new Date(),
    };
  }
  public create(payload: ICreateContract): Partial<IContract> {
    const { authorId, contractCategoryId, recipientEmail } = payload;

    return {
      authorId,
      contractCategoryId,
      recipientEmail,
    };
  }

  public update(payload: IUpdateContract): Partial<IContract> {
    const { authorId, contractCategoryId, recipientEmail, status } = payload;

    return {
      ...(authorId && { authorId }),
      ...(contractCategoryId && { contractCategoryId }),
      ...(recipientEmail && { recipientEmail }),
      ...(status && { status }),
    };
  }

  public signContract(payload: IContractSignature): Partial<IContractSignature> {
    const { contractId, signature, recipientEmail } = payload;

    return {
      contractId,
      signature,
      recipientEmail,
      signatureDate: new Date(),
    };
  }

  public getContracts(payload: ICreateContract): Partial<IContract> {
    const { authorId, recipientEmail } = payload;

    return {
      authorId,
      recipientEmail,
    };
  }

  public inviteRecipient(payload: IInviteRecipient): Partial<IInviteRecipient> {
    const { authorId, contractId, inviteeEmail } = payload;

    return {
      authorId,
      contractId,
      invitationDate: new Date(),
      inviteeEmail,
    };
  }

  public updateRecipientId(payload: IUpdateRecipientId): Partial<IContract> {
    const { contractId, userEmail, userId } = payload;

    return {
      id: contractId,
      inviteeEmail: userEmail,
      recipientId: userId,
    };
  }
}
