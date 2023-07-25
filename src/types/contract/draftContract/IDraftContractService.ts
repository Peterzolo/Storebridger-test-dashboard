import { IDraftContract } from './IDraftContract';
import { ICreateDraftContract } from './IDraftContractDTO';

export interface IDraftContractService {
  create(payload: ICreateDraftContract): Promise<Partial<IDraftContract>>;
  readMany(payload: { userEmail: string }): Promise<Partial<IDraftContract>[]>;
}
