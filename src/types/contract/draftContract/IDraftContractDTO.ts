import { IDraftContract } from './IDraftContract';

export interface ICreateDraftContract {
  authorEmail: string;
  authorId: string;
  contract: string;
}

export interface IReadDraftContract {
  id?: string;
  authorId?: string;
}

export interface IDraftContractDTO {
  create(payload: ICreateDraftContract): Partial<IDraftContract>;
}
