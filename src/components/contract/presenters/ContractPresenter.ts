import _ from 'lodash';
import { injectable } from 'inversify';
import { IContract, IContractPresenter } from '../../../types/contract';

export const CONTRACT_PRESENTER = Symbol('ContractPresenter');

@injectable()
export class ContractPresenter implements IContractPresenter {
  public serialize(
    contractDocument: IContract,
    selectors: Array<keyof IContract> = ['authorId', 'id'],
  ): Partial<IContract> {
    const contractEntity = {
      id: contractDocument.id,
      recipientEmail: contractDocument.recipientEmail,
      authorId: contractDocument.authorId,
      recipientId: contractDocument.recipientId,
      contractCategoryId: contractDocument.contractCategoryId,
      authorSignature: contractDocument.authorSignature,
      recipientSignature: contractDocument.recipientSignature,
      hasRecipientSigned: !!contractDocument.recipientSignature,
      hasAuthorSigned: !!contractDocument.authorSignature,
      contentTemplateId: contractDocument.contentTemplateId,
      status: contractDocument.status,
      effectiveOn: contractDocument.effectiveOn,
      createdAt: contractDocument.createdAt,
      updatedAt: contractDocument.updatedAt,
      inviteeEmail: contractDocument.inviteeEmail,
      invitationDate: contractDocument.invitationDate,
      authorSignatureDate: contractDocument.authorSignatureDate,
      recipientSignatureDate: contractDocument.recipientSignatureDate,
    };

    return _.pick(contractEntity, selectors);
  }
}
