import {
  IContract,
  IContractAppeal,
  IContractCategory,
  IContractContentTemplate,
  IContractTemplatePlaceholder,
} from './IContract';

export interface ICreateContract {
  authorId: string;
  contractCategoryId?: string;
  authorEmail: string;
  recipientEmail: string;
}

export interface IUpdateContract {
  authorId?: string;
  contractCategoryId?: string;
  authorEmail?: string;
  status?: string;
  recipientId?: string;
  recipientEmail?: string;
  authorSignature?: string;
  recipientSignature?: string;
  inviteeEmail?: string;
  invitationDate?: Date;
}

export interface IReadContract {
  ids?: string;
  id?: string;
  authorId?: string;
  inviteeEmail?: string;
}

export interface ICreateContractCategory {
  title: string;
  createdBy: string;
}

export interface ICreateContractContentTemplate {
  contractId: string;
  placeholders: IContractTemplatePlaceholder;
}

export interface IContractSignature {
  contractId: string;
  userEmail?: string;
  signature?: string;
  recipientEmail?: string;
  signatureDate?: Date;
}

export interface IInviteRecipient {
  contractId: string;
  userEmail?: string;
  authorId: string;
  inviteeEmail: string;
  invitationDate?: Date;
}

export interface IUpdateRecipientId {
  userEmail: string;
  contractId: string;
  userId?: string;
}

export interface ICreateContractAppeal {
  contractId: string;
  appealRaiserId: string;
  complaint: string;
  mediaProofs?: string[];
}

export interface IAcceptContractInvitation {
  contractId: string;
  userEmail?: string;
  userId?: string;
  inviteAcceptanceDate?: Date;
}

export interface IContractDTO {
  create(payload: ICreateContract): Partial<IContract>;

  signContract(payload: IContractSignature): Partial<IContractSignature>;

  getContracts(payload: Partial<ICreateContract>): Partial<IContract>;

  update(payload: IUpdateContract): Partial<IContract>;

  inviteRecipient(payload: IInviteRecipient): Partial<IInviteRecipient>;

  updateRecipientId(payload: IUpdateRecipientId): Partial<IContract>;

  acceptContractInvitation(payload: IAcceptContractInvitation): IAcceptContractInvitation;
}

export interface IContractCategoryDTO {
  create(payload: ICreateContractCategory): Partial<IContractCategory>;
}

export interface IContractContentTemplateDTO {
  create(payload: ICreateContractContentTemplate): Partial<IContractContentTemplate>;
}

export interface IContractAppealDTO {
  create(payload: ICreateContractAppeal): Partial<IContractAppeal>;
}
