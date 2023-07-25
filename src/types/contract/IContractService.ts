import { IContract, IContractAppeal, IContractCategory, IContractContentTemplate } from './IContract';
import {
  IAcceptContractInvitation,
  IContractSignature,
  ICreateContract,
  ICreateContractAppeal,
  ICreateContractCategory,
  ICreateContractContentTemplate,
  IInviteRecipient,
  IReadContract,
  IUpdateContract,
} from './IContractDTO';

export interface IContractCategoryService {
  create(payload: ICreateContractCategory): Promise<Partial<IContractCategory>>;

  readMany(): Promise<Array<Partial<IContractCategory>>>;

  read(query: Record<string, unknown>): Promise<IContractCategory | null>;
}

export interface IContractService {
  create(payload: ICreateContract): Promise<Partial<IContract>>;

  read(query: IReadContract): Promise<Partial<IContract> | null>;

  readMany(payload?: { query: IReadContract; userEmail: string }): Promise<Partial<IContract>[]>;

  update(query: IReadContract, payload: IUpdateContract): Promise<Partial<IContract>>;

  getContractsByUser(email: string): Promise<Array<Partial<IContract>>>;

  signAgreement(payload: IContractSignature): Promise<Partial<IContract>>;

  inviteRecipient(payload: IInviteRecipient): Promise<Partial<IContract>>;

  appeal(payload: ICreateContractAppeal): Promise<Partial<IContractAppeal>>;

  acceptContractInvitation(payload: IAcceptContractInvitation): Promise<Partial<IContract>>;
}

export interface IContractContentTemplateService {
  create(payload: ICreateContractContentTemplate): Promise<Partial<IContractContentTemplate>>;

  read(query: { contractId: string }): Promise<Partial<IContractContentTemplate> | null>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(query: { contractId: string }, payload: any): Promise<Partial<IContractContentTemplate> | null>;
}
