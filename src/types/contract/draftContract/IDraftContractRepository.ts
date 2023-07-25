import { Read, Write } from '../../../databases/mongodb';
import { IDraftContract } from './IDraftContract';
import { ICreateDraftContract } from './IDraftContractDTO';

export interface IDraftContractRepository extends Read<IDraftContract>, Write<IDraftContract> {}

export interface IDraftContractDTO {
  create(payload: ICreateDraftContract): Partial<IDraftContract>;
}
