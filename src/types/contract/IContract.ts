import { Date } from 'mongoose';

export interface IContract {
  id: string;
  authorId: string;
  contractCategoryId: string;
  recipientId: string;
  recipientEmail: string;
  authorSignature: string;
  recipientSignature: string;
  contentTemplateId: string;
  status: string;
  effectiveOn: Date;
  inviteeEmail: string;
  invitationDate: Date;
  inviteAcceptanceDate: Date;
  createdAt: Date;
  updatedAt: Date;
  hasRecipientSigned?: boolean;
  hasAuthorSigned: boolean;
  authorSignatureDate: Date;
  recipientSignatureDate: Date;
}

export interface IContractCategory {
  id: string;
  title: string;
  categoryId: string;
  createdBy: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string;
  isArchived: boolean;
}

export interface IContractTemplatePlaceholder {
  orderItemClauses?: Record<string, object>;
  orderId: string;
  orderTotalAmount: number;
  sellerId?: string | null;
  buyerId?: string | null;
  authorCountryOfResidence?: string;
  contractType: string;

  [key: string]: string | number | object | undefined | null;
}

export interface IContractContentTemplate {
  id: string;
  contractId: string;
  placeholders: IContractTemplatePlaceholder;
}

export interface IContractAppeal {
  id: string;
  contractId: string;
  appealRaiserId: string;
  complaint: string;
  attachment?: string[];
}
